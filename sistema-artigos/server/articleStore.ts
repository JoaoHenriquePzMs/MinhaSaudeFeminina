import {
  filterVisibleArticles,
  type ArticleResponse,
  type ImportedArticle,
} from "./articles";

const articles = new Map<string, ArticleResponse>();

function nowIso() {
  return new Date().toISOString();
}

function toResponse(article: ImportedArticle, previous?: ArticleResponse): ArticleResponse {
  const updatedAt = article.updatedAt ?? nowIso();

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
    createdAt: previous?.createdAt ?? updatedAt,
    updatedAt,
  };
}

export function replaceImportedArticles(rows: ImportedArticle[]) {
  for (const row of rows) {
    const previous = articles.get(row.id);
    articles.set(row.id, toResponse(row, previous));
  }

  return rows.length;
}

export function searchStoredArticles(viewerId: string | null, query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const rows = Array.from(articles.values()).filter(article => {
    if (!normalizedQuery) return true;

    return [article.title, article.excerpt, article.category, article.author]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });

  return filterVisibleArticles(rows, viewerId).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
}

export function clearStoredArticles() {
  articles.clear();
}
