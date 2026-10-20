import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-public.server-BljTV0Ua.js
/**
* Server-side Supabase client using the publishable (anon) key.
* Used for public reads and for the token-gated ingest RPC on deployments
* where the service-role key is not available.
*/
function publicServerClient() {
	const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"] ?? process.env["NEXT_PUBLIC_SUPABASE_URL"];
	const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
	return createClient(url, key, {
		auth: { persistSession: false },
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
			h.set("apikey", key);
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 12e3);
			const requestInit = {
				...init,
				headers: h,
				signal: controller.signal
			};
			return fetch(input, requestInit).finally(() => clearTimeout(timeout));
		} }
	});
}
//#endregion
export { publicServerClient };
