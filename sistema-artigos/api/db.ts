import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import type {
  ArticleInput,
  ImportedArticle,
  StoredArticle,
} from "./contracts.js";
import { serializeArticle } from "./contracts.js";
import { articles } from "./schema.js";

type Database = ReturnType<typeof drizzle>;

let db: Database | null = null;

function getDb(): Database {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL não configurada para a API de artigos.");
    }
    db = drizzle(process.env.DATABASE_URL);
  }

  return db;
}

function getAffectedRows(result: unknown): number {
  // O adapter mysql2 do Drizzle retorna ResultSetHeader; os testes e alguns
  // adapters retornam esse header dentro de um array. Aceitamos os dois formatos.
  const value = Array.isArray(result) ? result[0] : result;
  if (!value || typeof value !== "object" || !("affectedRows" in value)) {
    return 0;
  }

  const affectedRows = (value as { affectedRows?: unknown }).affectedRows;
  return typeof affectedRows === "number"
    ? affectedRows
    : Number(affectedRows) || 0;
}

export async function searchArticles(
  viewerId: string | null,
  query = ""
): Promise<StoredArticle[]> {
  const value = query.trim().toLocaleLowerCase();
  const rows = await getDb()
    .select()
    .from(articles)
    .orderBy(desc(articles.updatedAt));

  return rows
    .map(row => serializeArticle(row))
    .filter(
      article => article.status === "Publicado" || article.ownerId === viewerId
    )
    .filter(article => {
      if (!value) return true;
      return [article.title, article.excerpt, article.category, article.author]
        .join(" ")
        .toLocaleLowerCase()
        .includes(value);
    });
}

export async function getArticleById(
  id: string
): Promise<StoredArticle | undefined> {
  const rows = await getDb()
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  return rows[0] ? serializeArticle(rows[0]) : undefined;
}

export async function upsertArticles(rows: ImportedArticle[]): Promise<number> {
  const database = getDb();

  for (const row of rows) {
    const updatedAt = row.updatedAt ? new Date(row.updatedAt) : new Date();
    const values = {
      id: row.id,
      ownerId: row.ownerId,
      author: row.author,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      category: row.category,
      status: row.status,
      content: row.content,
      updatedAt,
    };

    await database
      .insert(articles)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          ownerId: values.ownerId,
          author: values.author,
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          category: values.category,
          status: values.status,
          content: values.content,
          updatedAt,
        },
      });
  }

  return rows.length;
}

export async function updateArticle(
  id: string,
  ownerId: string,
  input: ArticleInput
): Promise<boolean> {
  const result = await getDb()
    .update(articles)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(articles.id, id), eq(articles.ownerId, ownerId)));

  return getAffectedRows(result) > 0;
}

export async function deleteArticle(
  id: string,
  ownerId: string
): Promise<boolean> {
  const result = await getDb()
    .delete(articles)
    .where(and(eq(articles.id, id), eq(articles.ownerId, ownerId)));

  return getAffectedRows(result) > 0;
}
