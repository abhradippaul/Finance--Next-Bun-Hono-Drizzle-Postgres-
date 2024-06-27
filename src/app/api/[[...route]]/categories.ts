import { db } from "@/db/index";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { categories, insertCategoriesSchema } from "@/db/Schema";
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
      const categories = await db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.userId, auth.userId),
        columns: {
          id: true,
          name: true,
        },
      });

      return c.json(
        {
          success: true,
          message: "Categories found successfully",
          categories,
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

      const data = await db.query.categories.findFirst({
        where: (categories, { eq, and }) =>
          and(eq(categories.userId, auth.userId), eq(categories.id, id)),
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
      insertCategoriesSchema.pick({
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
      await db.insert(categories).values({
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
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids)
          )
        )
        .returning({
          id: categories.id,
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
      insertCategoriesSchema.pick({
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
        .update(categories)
        .set({
          name,
        })
        .where(and(eq(categories.userId, auth?.userId), eq(categories.id, id)));

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
