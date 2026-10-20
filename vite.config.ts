// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

if (process.env["npm_lifecycle_event"] === "build" || process.env["VERCEL"]) {
  process.env["NODE_ENV"] = "production";
}

// Production builds must use Nitro's Vercel preset so the generated artifact
// contains a valid Vercel function instead of the default Cloudflare worker.
// Outside development (and always during Vercel builds, both Production and Preview),
// build the full-stack server using Nitro's Vercel preset so .vercel/output/config.json
// and the serverless functions are generated reliably for all Vercel deployments.
const isVercel = Boolean(process.env["VERCEL"]);
const isBuild =
  process.env["npm_lifecycle_event"] === "build" ||
  process.env["NODE_ENV"] === "production";
const isDev =
  process.env["npm_lifecycle_event"] === "dev" ||
  (process.env["NODE_ENV"] === "development" && !isVercel);

const shouldEnableVercelNitro = isVercel || (isBuild && !isDev);

const nitro = shouldEnableVercelNitro
  ? ({
      preset: "vercel",
      vercel: { entryFormat: "node", functions: { runtime: "nodejs22.x" } },
      noExternals: true,
    } as const)
  : undefined;

export default defineConfig({
  ...(nitro ? { nitro } : {}),
});
