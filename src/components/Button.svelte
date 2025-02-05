<script lang="ts">
  const { children, ...props } = $props()
</script>

<button
  type="button"
  {...props}
  class={[
    "text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-hidden focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2",
    props.class
  ]}>
  {@render children()}
</button>
