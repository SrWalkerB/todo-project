import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["cjs"],
  target: "node22",
  clean: true,
  sourcemap: true,
  bundle: true,
  minify: false,
  loader: {
    ".sql": "text"
  },
  ignoreWatch: ["src/db/migrations/**/*.sql"]
})
