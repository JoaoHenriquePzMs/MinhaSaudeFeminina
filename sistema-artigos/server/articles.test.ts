import { describe, expect, it } from "vitest";
import {
  filterVisibleArticles,
  importedArticlesSchema,
  isArticleVisible,
} from "./articles";

const articles = [
  { id: "own-draft", ownerId: "user-current", status: "Rascunho" },
  { id: "other-draft", ownerId: "user-other", status: "Rascunho" },
  { id: "other-published", ownerId: "user-other", status: "Publicado" },
];

describe("article visibility", () => {
  it("keeps the owner's draft visible", () => {
    expect(isArticleVisible(articles[0], "user-current")).toBe(true);
  });

  it("hides another user's draft", () => {
    expect(isArticleVisible(articles[1], "user-current")).toBe(false);
  });

  it("keeps another user's published article visible", () => {
    expect(isArticleVisible(articles[2], "user-current")).toBe(true);
  });

  it("filters a list according to owner and status", () => {
    expect(
      filterVisibleArticles(articles, "user-current").map((article) => article.id),
    ).toEqual(["own-draft", "other-published"]);
  });
});

describe("imported article payload", () => {
  it("accepts the JSON contract used by the external search API", () => {
    const result = importedArticlesSchema.safeParse({
      articles: [
        {
          id: "api-001",
          ownerId: "user-api",
          author: "Autora API",
          title: "Conteúdo recebido",
          slug: "conteudo-recebido",
          excerpt: "Resumo do conteúdo.",
          category: "Autocuidado",
          status: "Publicado",
          content: "<p>Conteúdo recebido pela API.</p>",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown article statuses", () => {
    const result = importedArticlesSchema.safeParse({
      articles: [
        {
          id: "api-002",
          ownerId: "user-api",
          author: "Autora API",
          title: "Conteúdo inválido",
          slug: "conteudo-invalido",
          excerpt: "Resumo.",
          category: "Autocuidado",
          status: "Em revisão",
          content: "<p>Conteúdo.</p>",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
