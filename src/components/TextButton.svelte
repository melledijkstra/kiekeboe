<script lang="ts">
  const { children, className = '', ...props } = $props()
</script>

<button class="{className} text-slate-200 hover:text-white text-lg capitalize" {...props}>
  {@render children()}
</button>
