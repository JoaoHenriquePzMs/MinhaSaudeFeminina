import { defineConfig } from "vitest/config";
import path from "node:path";

const apiRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: apiRoot,
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.spec.ts"],
  },
});
