<script lang="ts">
  import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements'
  import Icon from './Icon.svelte'
  import type { Snippet } from 'svelte'

  type IconButtonProps = {
    icon: string;
    children?: Snippet;
  } & HTMLButtonAttributes;

  const { icon, children, ...props }: IconButtonProps = $props()

  function hasColorClass(classProp: ClassValue | null | undefined): boolean {
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
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'block cursor-pointer transition-colors',
  ]}
>
  <Icon path={icon} size={!children ? 36 : 20} />
  {@render children?.()}
</button>
