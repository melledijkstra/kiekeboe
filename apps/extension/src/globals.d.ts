// @see https://github.com/DeeCode-inc/tanstack-query-chrome-devtools
// needed to make the tanstack query inspector extension work
interface Window {
  __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
}
