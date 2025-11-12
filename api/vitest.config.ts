import { defineConfig } from "vitest/config"
import dotenv from "dotenv"
import tsconfigPaths from "vite-tsconfig-paths"

dotenv.config({
  path: ".env.test"
})

export default defineConfig({
  root: ".",
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    env: process.env,
    setupFiles: ["./vitest.setup.ts"],
    reporters: ["html", "default"],
    coverage: {
      enabled: true,
    }
  }
})
