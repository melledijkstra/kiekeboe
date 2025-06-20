<script lang="ts">
  import Icon from './Icon.svelte'

  const { icon, children = null, ...props } = $props()

  function hasColorClass(classProp: string | string[] | undefined): boolean {
    if (typeof classProp === 'string') {
      return classProp.includes('text-') || classProp.includes('bg-');
    }
    if (Array.isArray(classProp)) {
      return classProp.some((cls) => cls.includes('text-') || cls.includes('bg-'));
    }
    return false;
  }

  const hasColor = hasColorClass(props?.class);
</script>

<button
  {...props}
  class={[
    props.class,
    !hasColor && 'dark:text-white/70 dark:hover:text-white text-zinc-500 hover:text-zinc-700',
    'block cursor-pointer transition-colors',
  ]}
>
  <Icon path={icon} size={!children ? 40 : 24} />
  {@render children?.()}
</button>
