import { z } from "zod";

export const articleStatusSchema = z.enum(["Rascunho", "Publicado"]);

export const articleSearchSchema = z.object({
  query: z.string().trim().max(200).optional(),
});

export const articleFieldsSchema = z.object({
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().max(255),
  excerpt: z.string().trim().max(1000),
  category: z.string().trim().min(1).max(120),
  content: z.string(),
  status: articleStatusSchema,
});

export const importedArticleSchema = articleFieldsSchema.extend({
  id: z.string().trim().min(1).max(64),
  ownerId: z.string().trim().min(1).max(64),
  author: z.string().trim().min(1).max(255),
  updatedAt: z.string().datetime().optional(),
});

export const importedArticlesSchema = z.object({
  articles: z.array(importedArticleSchema),
});

export type ArticleInput = z.infer<typeof articleFieldsSchema>;
export type ImportedArticle = z.infer<typeof importedArticleSchema>;

export type ArticleResponse = {
  id: string;
  ownerId: string;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "Rascunho" | "Publicado";
  content: string;
  updatedAt: string;
  createdAt: string;
};

export function isArticleVisible(
  article: { ownerId: string; status: string },
  viewerId: string | null
) {
  return article.status === "Publicado" || article.ownerId === viewerId;
}

export function filterVisibleArticles<
  T extends { ownerId: string; status: string },
>(articles: T[], viewerId: string | null) {
  return articles.filter(article => isArticleVisible(article, viewerId));
}

export function getViewerId(openId?: string | null) {
  return openId || null;
}

export function serializeArticle(article: {
  id: string;
  ownerId: string;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "Rascunho" | "Publicado";
  content: string;
  updatedAt: Date | string;
  createdAt: Date | string;
}): ArticleResponse {
  return {
    id: article.id,
    ownerId: article.ownerId,
    author: article.author,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    status: article.status,
    content: article.content,
  updatedAt: new Date(article.updatedAt).toISOString(),
  createdAt: new Date(article.createdAt).toISOString(),
  };
}
