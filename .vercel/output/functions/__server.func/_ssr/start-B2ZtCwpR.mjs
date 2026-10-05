import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as createMiddleware, t as createCsrfMiddleware } from "./createCsrfMiddleware-B2To0gPJ.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-B2ZtCwpR.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
function brokeredPreviewStorage() {
	if (typeof window === "undefined") return void 0;
	const host = location.hostname;
	const projectId = [
		"lovableproject.com",
		"lovableproject-dev.com",
		"lovable.app",
		"gpt-eng.com",
		"gptengineer.run"
	].some((z) => host === z || host.endsWith("." + z)) ? host.match(/* @__PURE__ */ new RegExp("^(?:id-preview(?:-[a-z0-9]+)?|project)--([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-dev)?(?=\\.|$)", "i"))?.[1] ?? host.match(/* @__PURE__ */ new RegExp("^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?=[.-])", "i"))?.[1] : void 0;
	const framed = window.parent && window.parent !== window;
	if (!projectId || !framed) return localStorage;
	const dev = host.endsWith(".lovableproject-dev.com") || host.endsWith(".gpt-eng.com");
	const EDITOR = dev ? /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$|^http:\/\/localhost:3000$/ : /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$/;
	const ancestor = location.ancestorOrigins && location.ancestorOrigins[0] || (document.referrer ? new URL(document.referrer).origin : "");
	const editorOrigins = ancestor && EDITOR.test(ancestor) ? [ancestor] : dev ? ["https://lovable.dev", "http://localhost:3000"] : ["https://lovable.dev"];
	const RESULT = "lovable-preview-auth:result";
	const TIMEOUT = 2e3;
	const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
	const request = (type, key, value) => new Promise((resolve) => {
		const requestId = newId();
		let done = false;
		let timer = null;
		const finish = (r) => {
			if (done) return;
			done = true;
			if (timer) clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(r);
		};
		const onMessage = (e) => {
			if (editorOrigins.indexOf(e.origin) < 0) return;
			const d = e.data;
			if (d && d.type === RESULT && d.requestId === requestId) finish(d);
		};
		window.addEventListener("message", onMessage);
		const msg = {
			type,
			requestId,
			projectId,
			key
		};
		if (value !== void 0) msg["value"] = value;
		for (const origin of editorOrigins) window.parent.postMessage(msg, origin);
		timer = setTimeout(() => finish(null), TIMEOUT);
	});
	let firstGet = true;
	const RETRY_DELAY = 250;
	return {
		getItem: async (key) => {
			let res = await request("lovable-preview-auth:get", key);
			if (!res && firstGet) {
				await new Promise((r) => setTimeout(r, RETRY_DELAY));
				res = await request("lovable-preview-auth:get", key);
			}
			firstGet = false;
			if (res && res.ok && typeof res.value === "string") {
				if (res.value === "") {
					localStorage.removeItem(key);
					return null;
				}
				return res.value;
			}
			return localStorage.getItem(key);
		},
		setItem: (key, value) => {
			localStorage.setItem(key, value);
			return request("lovable-preview-auth:set", key, value).then(() => void 0);
		},
		removeItem: (key) => {
			localStorage.removeItem(key);
			return request("lovable-preview-auth:remove", key).then(() => void 0);
		}
	};
}
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseClient() {
	const SUPABASE_URL = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "nvodgsvqhjwwrqbfrkfc",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_IrsvnlbCi2WxhnljjP7vig_Ku2Wc1YF",
		"VITE_SUPABASE_URL": "https://c--bbafee09-c587-4388-9b19-6e832f97bc63-prod.lovable.cloud"
	}["VITE_SUPABASE_URL"] || {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "nvodgsvqhjwwrqbfrkfc",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_IrsvnlbCi2WxhnljjP7vig_Ku2Wc1YF",
		"VITE_SUPABASE_URL": "https://c--bbafee09-c587-4388-9b19-6e832f97bc63-prod.lovable.cloud"
	}["NEXT_PUBLIC_SUPABASE_URL"] || process.env["SUPABASE_URL"] || process.env["NEXT_PUBLIC_SUPABASE_URL"];
	const SUPABASE_PUBLISHABLE_KEY = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "nvodgsvqhjwwrqbfrkfc",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_IrsvnlbCi2WxhnljjP7vig_Ku2Wc1YF",
		"VITE_SUPABASE_URL": "https://c--bbafee09-c587-4388-9b19-6e832f97bc63-prod.lovable.cloud"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"] || {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "nvodgsvqhjwwrqbfrkfc",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_IrsvnlbCi2WxhnljjP7vig_Ku2Wc1YF",
		"VITE_SUPABASE_URL": "https://c--bbafee09-c587-4388-9b19-6e832f97bc63-prod.lovable.cloud"
	}["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		console.warn("[Supabase] Missing credentials; using mock in-memory client.");
		const dummyQuery = () => {
			const builder = new Proxy({}, { get: (_, prop) => {
				if (prop === "single" || prop === "maybeSingle") return async () => ({
					data: null,
					error: null
				});
				if (prop === "then") return (resolve) => Promise.resolve({
					data: [],
					error: null,
					count: 0
				}).then(resolve);
				return () => builder;
			} });
			return builder;
		};
		return {
			auth: {
				getSession: async () => ({
					data: { session: null },
					error: null
				}),
				onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
				getUser: async () => ({
					data: { user: null },
					error: null
				}),
				signInWithPassword: async () => ({
					data: {
						session: null,
						user: null
					},
					error: /* @__PURE__ */ new Error("Supabase credentials not configured")
				}),
				signOut: async () => ({ error: null })
			},
			from: () => dummyQuery(),
			rpc: async () => ({
				data: 0,
				error: null
			})
		};
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
		auth: {
			storage: brokeredPreviewStorage(),
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(error instanceof Error ? error.stack || error.message : String(error)), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({
	functionMiddleware: [attachSupabaseAuth],
	requestMiddleware: [errorMiddleware, csrfMiddleware]
}));
//#endregion
export { startInstance };
