// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Production builds must use Nitro's Vercel preset so the generated artifact
// contains a valid Vercel function instead of the default Cloudflare worker.
// Keep Nitro disabled during development: TanStack Start's native dev server
// serves the client entry correctly and avoids an unserved internal module.
const isProductionBuild =
  process.env["NODE_ENV"] === "production" ||
  process.env["npm_lifecycle_event"] === "build";

const nitro = isProductionBuild
  ? ({
      preset: "vercel",
      vercel: { entryFormat: "node", functions: { runtime: "nodejs20.x" } },
    } as const)
  : undefined;

export default defineConfig({
  ...(nitro ? { nitro } : {}),
});
