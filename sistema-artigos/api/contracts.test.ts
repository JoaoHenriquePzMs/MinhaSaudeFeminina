import { describe, expect, it } from "vitest";
import {
  importedArticlesSchema,
  isArticleVisible,
} from "./contracts.js";

describe("articles API contract", () => {
  it("accepts the payload sent by the external API", () => {
    const result = importedArticlesSchema.safeParse({
      articles: [
        {
          id: "art-001",
          ownerId: "owner-001",
          author: "Autora",
          title: "Saúde íntima",
          slug: "saude-intima",
          excerpt: "Resumo",
          category: "Autocuidado",
          status: "Publicado",
          content: "<p>Conteúdo</p>",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("hides another user's drafts", () => {
    const draft = {
      id: "art-001",
      ownerId: "owner-001",
      author: "Autora",
      title: "Rascunho",
      slug: "rascunho",
      excerpt: "Resumo",
      category: "Autocuidado",
      status: "Rascunho" as const,
      content: "<p>Conteúdo</p>",
      createdAt: "2026-08-28T12:00:00.000Z",
      updatedAt: "2026-08-28T12:00:00.000Z",
    };

    expect(isArticleVisible(draft, "other-owner")).toBe(false);
    expect(isArticleVisible(draft, "owner-001")).toBe(true);
  });
});
