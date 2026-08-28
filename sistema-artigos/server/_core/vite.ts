import fs from "node:fs";
import path from "node:path";
import type { Server } from "node:http";
import type { Express } from "express";
import express from "express";
import { createServer as createViteServer, type ViteDevServer } from "vite";

const projectRoot = process.cwd();
const clientRoot = path.resolve(projectRoot, "client");
const builtClientRoot = path.resolve(projectRoot, "dist", "public");

export async function setupVite(app: Express, server: Server) {
  const vite: ViteDevServer = await createViteServer({
    root: clientRoot,
    configFile: path.resolve(projectRoot, "vite.config.ts"),
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "spa",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const indexPath = path.resolve(clientRoot, "index.html");
      let template = fs.readFileSync(indexPath, "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  app.use(express.static(builtClientRoot));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(builtClientRoot, "index.html"));
  });
}
