import { beforeEach, describe, expect, it, vi } from "vitest";

const { fakeDb, drizzleMock } = vi.hoisted(() => {
  const rows = [
    {
      id: "art-001",
      ownerId: "owner-001",
      author: "Autora",
      title: "Saúde íntima",
      slug: "saude-intima",
      excerpt: "Resumo",
      category: "Autocuidado",
      status: "Publicado" as const,
      content: "<p>Conteúdo</p>",
      createdAt: new Date("2026-08-28T12:00:00.000Z"),
      updatedAt: new Date("2026-08-28T12:00:00.000Z"),
    },
  ];

  const fakeDb = {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        orderBy: vi.fn(async () => rows),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onDuplicateKeyUpdate: vi.fn(async () => undefined),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(async () => ({ affectedRows: 1 })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(async () => ({ affectedRows: 1 })),
    })),
  };

  return { fakeDb, drizzleMock: vi.fn(() => fakeDb) };
});

vi.mock("drizzle-orm/mysql2", () => ({ drizzle: drizzleMock }));

import {
  deleteArticle,
  searchArticles,
  updateArticle,
  upsertArticles,
} from "./db.js";

const article = {
  id: "art-001",
  ownerId: "owner-001",
  author: "Autora",
  title: "Saúde íntima",
  slug: "saude-intima",
  excerpt: "Resumo",
  category: "Autocuidado",
  status: "Publicado" as const,
  content: "<p>Conteúdo</p>",
};

beforeEach(() => {
  process.env.DATABASE_URL = "mysql://mock";
  vi.clearAllMocks();
});

describe("article persistence helpers", () => {
  it("upserts imported articles", async () => {
    await upsertArticles([article]);
    expect(fakeDb.insert).toHaveBeenCalledTimes(1);
  });

  it("searches and applies ownership visibility", async () => {
    const visible = await searchArticles(null, "saúde");
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("art-001");
  });

  it("updates an article for its owner", async () => {
    const updated = await updateArticle("art-001", "owner-001", article);
    expect(updated).toBe(true);
    expect(fakeDb.update).toHaveBeenCalledTimes(1);
  });

  it("deletes an article for its owner", async () => {
    const deleted = await deleteArticle("art-001", "owner-001");
    expect(deleted).toBe(true);
    expect(fakeDb.delete).toHaveBeenCalledTimes(1);
  });
});
