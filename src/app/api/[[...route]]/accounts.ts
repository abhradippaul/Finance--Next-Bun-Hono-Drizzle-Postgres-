import { db } from "@/db/index";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { accounts, insertAccountsSchema } from "@/db/Schema";
import { v4 } from "uuid";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";

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
        where: (accounts, { eq }) => eq(accounts.userId, auth.userId),
        columns: {
          id: true,
          name: true,
        },
      });

      if (!accounts?.length) {
        return c.json(
          {
            error: "Account not found",
          },
          404
        );
      }

      return c.json(
        {
          success: true,
          message: "Account found successfully",
          accounts,
        },
        200
      );
    } catch (err) {
      console.log(err);
      return c.json({
        error: err,
        message: "Something went wrong",
      });
    }
  })
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db.query.accounts.findFirst({
        where: (accounts, { eq, and }) =>
          and(eq(accounts.userId, auth.userId), eq(accounts.id, id)),
        columns: {
          id: true,
          name: true,
          userId: true,
        },
      });

      if (!data) {
        return c.json(
          {
            error: "Account not found",
          },
          404
        );
      }

      return c.json({
        message: "Account found successfully",
        data,
      });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountsSchema.pick({
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
      await db.insert(accounts).values({
        userId: auth?.userId,
        name,
        id: v4().toString(),
      });
      return c.json(
        {
          success: true,
          message: "Account created successfully",
        },
        201
      );
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }
      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

      if (!data.length) {
        return c.json(
          {
            error: "Account not found",
          },
          404
        );
      }

      return c.json({ message: "Account Deleted successfully" }, 200);
    }
  )
  .patch(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountsSchema.pick({
        name: true,
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { name, id } = c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      if (!name || !id) {
        return c.json(
          {
            error: "All fields are required",
          },
          400
        );
      }

      const data = await db
        .update(accounts)
        .set({
          name,
        })
        .where(and(eq(accounts.userId, auth?.userId), eq(accounts.id, id)));

      if (!data) {
        return c.json(
          {
            error: "Account not found",
          },
          404
        );
      }

      return c.json(
        {
          message: "Account info updated successfully",
        },
        200
      );
    }
  );

export default app;
