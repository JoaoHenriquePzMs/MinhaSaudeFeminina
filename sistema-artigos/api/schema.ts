import {
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const articles = mysqlTable("articles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["Rascunho", "Publicado"])
    .default("Rascunho")
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
