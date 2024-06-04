import { db } from "@/db/index";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { accounts, insertAccountSchema } from "@/db/Schema";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }
      // Database call
      const accounts = await db.query.accounts.findMany({
        where: (accounts, { eq }) => eq(accounts.id, "1"),
        columns: {
          id: true,
          name: true,
        },
      });

      return c.json({
        accounts,
      });
    } catch (err) {
      console.log(err);
      return c.json({
        error: err,
        message: "Something went wrong",
      });
    }
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { name } = c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }
      const data = await db.insert(accounts).values({
        userId: auth?.userId,
        name,
      });
      return c.json({});
    }
  );

export default app;
