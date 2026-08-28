import type { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import {
  articleFieldsSchema,
  articleSearchSchema,
  importedArticlesSchema,
} from "./articles";

function getDataApiUrl() {
  return (process.env.ARTICLE_DATA_API_URL || "http://localhost:4001").replace(
    /\/$/,
    ""
  );
}

function getApiTimeoutMs() {
  const configured = Number(process.env.ARTICLE_DATA_API_TIMEOUT_MS || 5000);
  return Number.isFinite(configured) && configured > 0 ? configured : 5000;
}

function getQueryValue(value: unknown) {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

async function getViewerId(req: Request) {
  try {
    const user = await sdk.authenticateRequest(req);
    return user?.openId ?? null;
  } catch {
    return null;
  }
}

async function getAuthenticatedUser(req: Request) {
  try {
    return await sdk.authenticateRequest(req);
  } catch {
    return null;
  }
}

function getApiKey() {
  return process.env.ARTICLE_SEARCH_API_KEY?.trim() || undefined;
}

function withApiKey(headers: Record<string, string>) {
  const apiKey = getApiKey();
  if (apiKey) headers["x-article-search-key"] = apiKey;
  return headers;
}

function hasValidInboundApiKey(req: Request) {
  const configuredKey = process.env.ARTICLE_SEARCH_API_KEY?.trim();
  return !configuredKey || req.header("x-article-search-key") === configuredKey;
}

async function fetchDataApi(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getApiTimeoutMs());

  try {
    return await fetch(`${getDataApiUrl()}${path}`, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function proxyResponse(response: globalThis.Response, res: Response) {
  const body = await response.text();
  res.status(response.status);
  res.type(response.headers.get("content-type") || "application/json");
  res.send(body);
}

async function sendArticleSearch(req: Request, res: Response) {
  const parsed = articleSearchSchema.safeParse({
    query: getQueryValue(req.query.q),
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Parâmetro de busca inválido." });
    return;
  }

  try {
    const query = parsed.data.query
      ? `?q=${encodeURIComponent(parsed.data.query)}`
      : "";
    const headers = { "x-viewer-id": (await getViewerId(req)) || "" };
    const upstream = await fetchDataApi(`/api/articles/search${query}`, {
      headers,
    });
    await proxyResponse(upstream, res);
  } catch (error) {
    console.error("[Server] Articles API unavailable:", error);
    res.status(502).json({ error: "A API de artigos está indisponível." });
  }
}

async function receiveSearchResults(req: Request, res: Response) {
  if (!hasValidInboundApiKey(req)) {
    res.status(401).json({ error: "Chave de ingestão inválida." });
    return;
  }

  const parsed = importedArticlesSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Payload inválido. Envie um objeto com a propriedade articles.",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const headers = withApiKey({ "content-type": "application/json" });
    const upstream = await fetchDataApi("/api/articles/search-results", {
      method: "POST",
      headers,
      body: JSON.stringify(parsed.data),
    });
    await proxyResponse(upstream, res);
  } catch (error) {
    console.error("[Server] Articles API unavailable:", error);
    res.status(502).json({ error: "A API de artigos está indisponível." });
  }
}

async function createArticle(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res
      .status(401)
      .json({ error: "É necessário estar autenticado para criar artigos." });
    return;
  }

  const parsed = articleFieldsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados do artigo inválidos." });
    return;
  }

  try {
    const headers = withApiKey({
      "content-type": "application/json",
      "x-viewer-id": user.openId,
    });
    const upstream = await fetchDataApi("/api/articles", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...parsed.data,
        id: crypto.randomUUID(),
        ownerId: user.openId,
        author: user.name || user.email || "Usuário",
      }),
    });
    await proxyResponse(upstream, res);
  } catch (error) {
    console.error("[Server] Articles API unavailable:", error);
    res.status(502).json({ error: "A API de artigos está indisponível." });
  }
}

async function updateArticle(req: Request, res: Response) {
  const parsed = articleFieldsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados do artigo inválidos." });
    return;
  }

  const viewerId = await getViewerId(req);
  if (!viewerId) {
    res
      .status(401)
      .json({ error: "É necessário estar autenticado para editar artigos." });
    return;
  }

  try {
    const headers = withApiKey({
      "content-type": "application/json",
      "x-viewer-id": viewerId,
    });
    const upstream = await fetchDataApi(
      `/api/articles/${encodeURIComponent(req.params.id)}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(parsed.data),
      }
    );
    await proxyResponse(upstream, res);
  } catch (error) {
    console.error("[Server] Articles API unavailable:", error);
    res.status(502).json({ error: "A API de artigos está indisponível." });
  }
}

async function deleteArticle(req: Request, res: Response) {
  const viewerId = await getViewerId(req);
  if (!viewerId) {
    res
      .status(401)
      .json({ error: "É necessário estar autenticado para excluir artigos." });
    return;
  }

  try {
    const headers = withApiKey({ "x-viewer-id": viewerId });
    const upstream = await fetchDataApi(
      `/api/articles/${encodeURIComponent(req.params.id)}`,
      { method: "DELETE", headers }
    );
    await proxyResponse(upstream, res);
  } catch (error) {
    console.error("[Server] Articles API unavailable:", error);
    res.status(502).json({ error: "A API de artigos está indisponível." });
  }
}

export function registerArticleRoutes(app: Express) {
  app.get("/api/articles", sendArticleSearch);
  app.get("/api/articles/search", sendArticleSearch);
  app.post("/api/articles", createArticle);
  app.post("/api/articles/search-results", receiveSearchResults);
  app.put("/api/articles/:id", updateArticle);
  app.delete("/api/articles/:id", deleteArticle);
}
