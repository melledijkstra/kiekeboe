<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"

  const {
    children,
    ...props
  }: HTMLAttributes<HTMLButtonElement> = $props()

  $inspect(props.class)
</script>

<button
  {...props}
  type="button"
  class={[
    'flex text-white focus:ring-4 focus:outline-hidden font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center me-2 mb-2 cursor-pointer',
    props.class ?? 'bg-primary hover:bg-primary/80 focus:ring-primary/50 dark:focus:ring-primary/55',
  ]}
>
  {@render children?.()}
</button>
