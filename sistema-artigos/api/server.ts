import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  articleFieldsSchema,
  articleSearchSchema,
  importedArticlesSchema,
} from "./contracts.js";
import {
  deleteArticle,
  getArticleById,
  searchArticles,
  updateArticle,
  upsertArticles,
} from "./db.js";

export const app = express();

app.use(express.json({ limit: "2mb" }));

function configuredApiKey() {
  return process.env.ARTICLE_SEARCH_API_KEY?.trim() || null;
}

function authorized(req: Request) {
  const apiKey = configuredApiKey();
  return !apiKey || req.header("x-article-search-key") === apiKey;
}

function viewerId(req: Request) {
  const value = req.header("x-viewer-id")?.trim();
  return value || null;
}

function getQueryValue(value: unknown) {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

function requireApiKey(req: Request, res: Response) {
  if (authorized(req)) return true;
  res.status(401).json({ error: "Chave de ingestão inválida." });
  return false;
}

function requireViewer(req: Request, res: Response) {
  const id = viewerId(req);
  if (id) return id;
  res.status(401).json({ error: "Identificador do usuário não informado." });
  return null;
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
    const articles = await searchArticles(
      viewerId(req),
      parsed.data.query ?? ""
    );
    res.json({ articles });
  } catch (error) {
    console.error("[Articles API] Search failed:", error);
    res.status(500).json({ error: "Não foi possível consultar os artigos." });
  }
}

async function receiveSearchResults(req: Request, res: Response) {
  if (!requireApiKey(req, res)) return;

  const parsed = importedArticlesSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Payload inválido. Envie um objeto com a propriedade articles.",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const received = await upsertArticles(parsed.data.articles);
    res.status(202).json({ success: true, received });
  } catch (error) {
    console.error("[Articles API] Import failed:", error);
    res.status(500).json({ error: "Não foi possível persistir os artigos." });
  }
}

async function createArticleRoute(req: Request, res: Response) {
  if (!requireApiKey(req, res)) return;

  const parsed = importedArticlesSchema.shape.articles.element.safeParse(
    req.body
  );
  if (!parsed.success) {
    res.status(400).json({ error: "Dados do artigo inválidos." });
    return;
  }

  try {
    await upsertArticles([parsed.data]);
    const article = await getArticleById(parsed.data.id);
    if (!article) {
      res
        .status(500)
        .json({ error: "O artigo não foi encontrado após o salvamento." });
      return;
    }
    res.status(201).json({ article });
  } catch (error) {
    console.error("[Articles API] Create failed:", error);
    res.status(500).json({ error: "Não foi possível criar o artigo." });
  }
}

async function updateArticleRoute(req: Request, res: Response) {
  if (!requireApiKey(req, res)) return;
  const ownerId = requireViewer(req, res);
  if (!ownerId) return;

  const parsed = articleFieldsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados do artigo inválidos." });
    return;
  }

  try {
    const updated = await updateArticle(req.params.id, ownerId, parsed.data);
    if (!updated) {
      res.status(404).json({ success: false });
      return;
    }

    const article = await getArticleById(req.params.id);
    if (!article) {
      res
        .status(500)
        .json({ error: "O artigo não foi encontrado após a atualização." });
      return;
    }

    res.status(200).json({ success: true, article });
  } catch (error) {
    console.error("[Articles API] Update failed:", error);
    res.status(500).json({ error: "Não foi possível atualizar o artigo." });
  }
}

async function deleteArticleRoute(req: Request, res: Response) {
  if (!requireApiKey(req, res)) return;
  const ownerId = requireViewer(req, res);
  if (!ownerId) return;

  try {
    const deleted = await deleteArticle(req.params.id, ownerId);
    res.status(deleted ? 200 : 404).json({ success: deleted });
  } catch (error) {
    console.error("[Articles API] Delete failed:", error);
    res.status(500).json({ error: "Não foi possível excluir o artigo." });
  }
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "articles-api" });
});

app.get(["/api/articles", "/api/articles/search"], sendArticleSearch);
app.post("/api/articles", createArticleRoute);
app.post("/api/articles/search-results", receiveSearchResults);
app.put("/api/articles/:id", updateArticleRoute);
app.delete("/api/articles/:id", deleteArticleRoute);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: "JSON inválido." });
    return;
  }
  console.error("[Articles API] Unexpected error:", error);
  res.status(500).json({ error: "Erro interno da API de artigos." });
});

if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
  const port = Number(process.env.API_PORT || 4001);
  app.listen(port, () => {
    console.log(`[Articles API] Listening on port ${port}`);
  });
}
