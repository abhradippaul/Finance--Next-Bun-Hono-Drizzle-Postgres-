import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const accountsRelation = relations(accounts, ({ many }) => ({
  transaction: many(transaction),
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const categoriesRelation = relations(categories, ({ many }) => ({
  transaction: many(transaction),
}));

export const insertCategoriesSchema = createInsertSchema(categories);

export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionRelation = relations(transaction, ({ one }) => ({
  accounts: one(accounts, {
    fields: [transaction.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transaction.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transaction, {
  date: z.coerce.date(),
});
