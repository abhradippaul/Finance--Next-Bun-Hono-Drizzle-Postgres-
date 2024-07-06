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
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
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

        const data = await db
          .select({
            id: transactions.id,
            category: categories.name,
            categoryId: transactions.categoryId,
            accountId: transactions.accountId,
            account: accounts.name,
            amount: transactions.amount,
            payee: transactions.payee,
            notes: transactions.notes,
            date: transactions.date,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .leftJoin(categories, eq(transactions.categoryId, categories.id))
          .where(
            and(
              accountId ? eq(transactions.accountId, accountId) : undefined,
              eq(accounts.userId, auth.userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
            )
          )
          .orderBy(desc(transactions.date));

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

      const data = await db
        .select({
          id: transactions.id,
          categoryId: transactions.categoryId,
          accountId: transactions.accountId,
          amount: transactions.amount,
          payee: transactions.payee,
          notes: transactions.notes,
          date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)));

      if (!data.length) {
        return c.json(
          {
            error: "Transaction not found",
          },
          404
        );
      }

      return c.json({
        message: "Account found successfully",
        data: data[0],
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
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid("json");
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      if (!id) {
        return c.json(
          {
            error: "Missing required field",
          },
          401
        );
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
      );

      const data = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set({
          ...value,
        })
        .where(
          eq(transactions.id, sql`(select id from ${transactionsToUpdate})`)
        )
        .returning({
          id: transactions.id,
        });

      if (!data.length) {
        return c.json(
          {
            error: "Failed to update transaction",
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
      try {
        const auth = getAuth(c);
        const { ids } = c.req.valid("json");

        if (!auth?.userId) {
          return c.json(
            {
              error: "Unauthorized",
            },
            401
          );
        }
        if (!ids.length) {
          return c.json({ error: "Missing required field" }, 401);
        }

        const transactionsToDelete = db.$with("transactions_to_delete").as(
          db
            .select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(accounts.id, transactions.accountId))
            .where(
              and(
                inArray(transactions.id, ids),
                eq(accounts.userId, auth.userId)
              )
            )
        );

        const data = await db
          .with(transactionsToDelete)
          .delete(transactions)
          .where(
            inArray(
              transactions.id,
              sql`(select id from ${transactionsToDelete})`
            )
          )
          .returning({
            id: transactions.id,
          });

        if (!data.length) {
          return c.json({ error: "No transactions found to delete" }, 404);
        }

        return c.json({ message: "Account Deleted successfully" }, 200);
      } catch (err: any) {
        return c.json(
          { error: err.message, message: "Internal Server Error" },
          500
        );
      }
    }
  );

export default app;
