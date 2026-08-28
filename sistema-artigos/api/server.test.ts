import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createServer, type Server } from "node:http";

vi.mock("./db", () => ({
  searchArticles: vi.fn(async () => []),
  getArticleById: vi.fn(async (id: string) => ({
    id,
    ownerId: "owner-001",
    author: "Autora",
    title: "Saúde íntima",
    slug: "saude-intima",
    excerpt: "Resumo",
    category: "Autocuidado",
    status: "Rascunho",
    content: "<p>Conteúdo</p>",
    createdAt: "2026-08-28T12:00:00.000Z",
    updatedAt: "2026-08-28T12:00:00.000Z",
  })),
  upsertArticles: vi.fn(async (rows: unknown[]) => rows.length),
  updateArticle: vi.fn(async () => true),
  deleteArticle: vi.fn(async () => true),
}));

import { app } from "./server.js";

let server: Server;
let baseUrl = "";

beforeAll(async () => {
  server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Servidor não iniciou");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(() => server.close());

describe("articles API HTTP", () => {
  it("returns health status", async () => {
    const response = await fetch(`${baseUrl}/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      service: "articles-api",
    });
  });

  it("keeps search public and supports the short route", async () => {
    const response = await fetch(`${baseUrl}/api/articles?q=saude`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ articles: [] });
  });

  it("validates and accepts article ingestion", async () => {
    const response = await fetch(`${baseUrl}/api/articles/search-results`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ articles: [] }),
    });

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ success: true, received: 0 });
  });

  it("creates an article and returns the persisted record", async () => {
    const response = await fetch(`${baseUrl}/api/articles`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-article-search-key": "",
      },
      body: JSON.stringify({
        id: "art-001",
        ownerId: "owner-001",
        author: "Autora",
        title: "Saúde íntima",
        slug: "saude-intima",
        excerpt: "Resumo",
        category: "Autocuidado",
        content: "<p>Conteúdo</p>",
        status: "Rascunho",
      }),
    });

    expect(response.status).toBe(201);
    expect((await response.json()).article.id).toBe("art-001");
  });

  it("rejects ingestion with an invalid configured key", async () => {
    const previousKey = process.env.ARTICLE_SEARCH_API_KEY;
    process.env.ARTICLE_SEARCH_API_KEY = "test-secret";

    try {
      const response = await fetch(`${baseUrl}/api/articles/search-results`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ articles: [] }),
      });

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: "Chave de ingestão inválida.",
      });
    } finally {
      if (previousKey === undefined) delete process.env.ARTICLE_SEARCH_API_KEY;
      else process.env.ARTICLE_SEARCH_API_KEY = previousKey;
    }
  });

  it("requires a viewer for administrative operations", async () => {
    const response = await fetch(`${baseUrl}/api/articles/art-001`, {
      method: "DELETE",
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Identificador do usuário não informado.",
    });
  });

  it("returns a validation error for malformed JSON", async () => {
    const response = await fetch(`${baseUrl}/api/articles/search-results`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{invalid",
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "JSON inválido." });
  });

  it("exposes update and delete routes", async () => {
    const update = await fetch(`${baseUrl}/api/articles/art-001`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-viewer-id": "owner-001",
      },
      body: JSON.stringify({
        title: "Saúde íntima",
        slug: "saude-intima",
        excerpt: "Resumo",
        category: "Autocuidado",
        content: "<p>Conteúdo</p>",
        status: "Publicado",
      }),
    });
    const remove = await fetch(`${baseUrl}/api/articles/art-001`, {
      method: "DELETE",
      headers: { "x-viewer-id": "owner-001" },
    });

    expect(update.status).toBe(200);
    const updateBody = await update.json();
    expect(updateBody.success).toBe(true);
    expect(updateBody.article.id).toBe("art-001");
    expect(remove.status).toBe(200);
    expect(await remove.json()).toEqual({ success: true });
  });
});
