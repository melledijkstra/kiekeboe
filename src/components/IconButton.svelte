<script lang="ts">
  import Icon from './Icon.svelte'

  const { icon, children = null, tooltip = '', ...props } = $props()
</script>

<button
  {...props}
  class={[
    props.class,
    tooltip && 'relative block group/tooltip',
    'block cursor-pointer text-white/70 transition-colors hover:text-white'
  ]}
>
  <Icon path={icon} size={!children ? 40 : 24} />
  {@render children?.()}
  {#if tooltip}
    <span
      class={[
        // general styles
        'absolute invisible z-10 top-[125%] w-[70px] -ml-[35px] bg-black/50 text-white text-center p-1 rounded-md',
        // animation
        'opacity-0 transition-opacity',
        // hovering
        'group-hover/tooltip:visible group-hover/tooltip:opacity-100',
        // tooltip arrow
        'after:absolute after:bottom-full after:left-1/2 after:-ml-[5px] after:border-[5px]',
        'after:border-t-transparent after:border-r-transparent after:border-b-[rgba(0,0,0,0.5)] after:border-l-transparent'
      ]}
    >
      {tooltip}
    </span>
  {/if}
</button>
