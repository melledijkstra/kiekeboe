<script lang="ts">
  import { MIN_5 } from "@/cache/memory"
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools"
  import type { Snippet } from "svelte"

  const { children }: { children: Snippet } = $props();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: MIN_5
      }
    }
  });

  window.__TANSTACK_QUERY_CLIENT__ = queryClient
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
  <SvelteQueryDevtools buttonPosition="bottom-left" />
</QueryClientProvider>