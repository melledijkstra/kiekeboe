<script lang="ts">
  const { children, className = '', ...props } = $props()
</script>

<button class="{className} text-slate-200 hover:text-white text-sm my-8 mx-5 capitalize" {...props}>
  {@render children()}
</button>
