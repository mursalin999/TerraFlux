// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Outside a Lovable build (e.g. Vercel CI), build the full-stack server with
// Nitro's `vercel` preset so server functions deploy as serverless functions.
// Inside Lovable, LOVABLE_NITRO_PRESET pins the target and this is ignored.
// Keep the Vercel Nitro preset for production builds only. The preview runs
// Vite's native TanStack Start dev server; enabling Nitro during dev makes the
// browser resolve the internal default client entry as an unserved module.
const nitro =
  process.env["VERCEL"] && process.env["NODE_ENV"] === "production"
    ? ({ preset: "vercel", vercel: { entryFormat: "node" } } as const)
    : undefined;

export default defineConfig({
  ...(nitro ? { nitro } : {}),
});
