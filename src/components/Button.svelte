<script lang="ts">
  const { children, className = '', ...props } = $props()
</script>

<button class="{className} text-slate-200 hover:text-white text-sm capitalize" {...props}>
  {@render children()}
</button>
