import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "./@radix-ui/react-collection+[...].mjs";
import { a as shouldThrowError, i as noop, n as QueryObserver, r as notifyManager } from "./tanstack__query-core.mjs";
//#region node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* The context that `useQueryClient` reads from. `QueryClientProvider` is the normal way to set it.
*/
var QueryClientContext = import_react.createContext(void 0);
/**
* The `useQueryClient` hook returns the current `QueryClient` instance.
*
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns The current `QueryClient` instance.
* @throws If no `queryClient` argument is passed and no `QueryClientProvider` is found in the component tree.
*/
var useQueryClient = (queryClient) => {
	const client = import_react.useContext(QueryClientContext);
	if (queryClient) return queryClient;
	if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
	return client;
};
/**
* Use the `QueryClientProvider` component to connect and provide a `QueryClient` to your application. Also
* calls `client.mount()`/`client.unmount()` as this component mounts/unmounts, which subscribes the client to
* focus/online events (resuming any paused mutations and refetching as needed when the app regains focus or
* comes back online).
*
* @returns The provided `children`, wrapped so they can read the `QueryClient` via `useQueryClient`.
*
* @example
* ```tsx
* import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
*
* const queryClient = new QueryClient()
*
* function App() {
*   return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
* }
* ```
*/
var QueryClientProvider = ({ client, children }) => {
	import_react.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientContext.Provider, {
		value: client,
		children
	});
};
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var IsRestoringContext = import_react.createContext(false);
/**
* If you are using `PersistQueryClientProvider`, you can also use the `useIsRestoring` hook alongside it to
* check if a restore is currently in progress. `useQuery` and friends also check this internally to avoid
* race conditions between the restore and mounting queries.
*
* @returns `true` while a persisted client is being restored, `false` otherwise.
*/
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
/**
* Resets any query errors within the boundary, so queries know they can try again.
*/
function createValue() {
	let isReset = false;
	return {
		/**
		* Clears the reset state, so queries know not to try again until the boundary is reset again.
		*/
		clearReset: () => {
			isReset = false;
		},
		/**
		* Resets any query errors within the boundary, so queries know they can try again.
		*/
		reset: () => {
			isReset = true;
		},
		/**
		* Returns whether the boundary has been reset and not yet cleared.
		*/
		isReset: () => {
			return isReset;
		}
	};
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
/**
* This hook will reset any query errors within the closest `QueryErrorResetBoundary`. If there is no boundary
* defined it will reset them globally.
*
* @returns The boundary's {@link QueryErrorResetBoundaryValue}.
*
* @example
* ```tsx
* import { ErrorBoundary } from 'react-error-boundary'
* import { useQueryErrorResetBoundary } from '@tanstack/react-query'
*
* function App({ children }: { children: React.ReactNode }) {
*   const { reset } = useQueryErrorResetBoundary()
*
*   return (
*     <ErrorBoundary
*       onReset={reset}
*       fallbackRender={({ resetErrorBoundary }) => (
*         <div>
*           There was an error!
*           <button onClick={() => resetErrorBoundary()}>Try again</button>
*         </div>
*       )}
*     >
*       {children}
*     </ErrorBoundary>
*   )
* }
* ```
*/
var useQueryErrorResetBoundary = () => import_react.useContext(QueryErrorResetBoundaryContext);
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
	import_react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/suspense.js
var ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function useBaseQuery(options, Observer, queryClient) {
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const client = useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	const subscribed = options.subscribed !== false;
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
	ensureSuspenseTimers(defaultedOptions);
	ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	useClearResetErrorBoundary(errorResetBoundary);
	const [observer] = import_react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && subscribed;
	import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	import_react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (shouldSuspend(defaultedOptions, result)) throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
//#endregion
export { QueryClientProvider as n, useQueryClient as r, useQuery as t };
