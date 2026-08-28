import type { Express, Request, Response } from "express";
import { storageGetSignedUrl } from "../storage";

export function registerStorageProxy(app: Express) {
  app.get(/^\/manus-storage\/(.+)$/, async (req: Request, res: Response) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).json({ error: "Storage key is required" });
      return;
    }

    try {
      const signedUrl = await storageGetSignedUrl(key);
      res.redirect(307, signedUrl);
    } catch (error) {
      console.error("[Storage] Failed to create signed URL", error);
      res.status(404).json({ error: "File not found" });
    }
  });
}
