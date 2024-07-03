import { db } from "@/db/index";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  insertTransactionsSchema,
  transactions,
  categories,
  accounts,
} from "@/db/Schema";
import { v4 } from "uuid";
import { z } from "zod";
import { and, asc, eq, gte, inArray, lte } from "drizzle-orm";
import { subDays, parse } from "date-fns";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
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
        const { accountId, from, to } = c.req.valid("query");
        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);
        const startDate = from
          ? parse(from, "yyyy-MM-dd", new Date())
          : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
        // Database call

        const data = await db.query.transactions.findMany({
          where: and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          ),
          orderBy: (transactions, { asc }) => [asc(transactions.date)],
          with: {
            categories: {
              columns: {
                name: true,
              },
            },
            accounts: {
              columns: {
                name: true,
              },
            },
          },
        });

        return c.json(
          {
            success: true,
            message: "Categories found successfully",
            data,
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
    }
  )
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

      const data = await db.query.transactions.findFirst({
        where: (transactions, { eq, and }) =>
          and(
            // eq(accounts.userId, auth.userId),
            eq(transactions.id, id)
          ),
      });

      if (!data) {
        return c.json(
          {
            error: "Transaction not found",
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
      insertTransactionsSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { accountId, amount, date, payee, categoryId, notes } =
        c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      if (!accountId || !date || !amount || !payee) {
        return c.json(
          {
            error: "Missing required fields",
          },
          401
        );
      }

      await db.insert(transactions).values({
        id: v4().toString(),
        amount,
        date,
        payee,
        notes,
        accountId,
        categoryId: categoryId || null,
      });
      return c.json(
        {
          success: true,
          message: "Account created successfully",
        },
        201
      );
    }
  );
// .patch(
//   "/",
//   clerkMiddleware(),
//   zValidator(
//     "json",
//     insertTransactionsSchema.omit({
//       id: true,
//     })
//   ),
//   async (c) => {
//     const auth = getAuth(c);
//     const value = c.req.valid("json");
//     if (!auth?.userId) {
//       return c.json(
//         {
//           error: "Unauthorized",
//         },
//         401
//       );
//     }

//     const data = await db
//       .update(categories)
//       .set({
//         name,
//       })
//       .where(and(eq(categories.userId, auth?.userId), eq(categories.id, id)));

//     if (!data) {
//       return c.json(
//         {
//           error: "Account not found",
//         },
//         404
//       );
//     }

//     return c.json(
//       {
//         message: "Account info updated successfully",
//       },
//       200
//     );
//   }
// );
// .post(
//   "/bulk-delete",
//   clerkMiddleware(),
//   zValidator(
//     "json",
//     z.object({
//       ids: z.array(z.string()),
//     })
//   ),
//   async (c) => {
//     const auth = getAuth(c);
//     const values = c.req.valid("json");
//     if (!auth?.userId) {
//       return c.json(
//         {
//           error: "Unauthorized",
//         },
//         401
//       );
//     }
//     const data = await db
//       .delete(transactions).

//     if (!data.length) {
//       return c.json(
//         {
//           error: "Account not found",
//         },
//         404
//       );
//     }

//     return c.json({ message: "Account Deleted successfully" }, 200);
//   }
// )

export default app;
