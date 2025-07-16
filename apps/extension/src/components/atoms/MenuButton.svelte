<script lang="ts">
  import { Tooltip } from "bits-ui";
  import Icon from "./Icon.svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"

  type MenuButtonProps = {
    mdiIcon: string;
    tooltip?: string;
    tooltipClass?: string | string[];
  } & HTMLButtonAttributes;

  const { mdiIcon, tooltip, ...props }: MenuButtonProps = $props();
</script>
 
<Tooltip.Provider>
  <Tooltip.Root delayDuration={0}>
    <Tooltip.Trigger
      class={[
        'text-white/70 hover:text-white',
        'block cursor-pointer transition-colors',
        props.class,
      ]}
      disabled={!tooltip}
    >
      {#snippet child({ props: childProps })}
        <button {...props} {...childProps}>
          <Icon path={mdiIcon} size={36} />
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content sideOffset={4}>
      <!-- putting "text-black" in order for arrow to pick it up the color and look the same as content -->
      <Tooltip.Arrow class="text-black/50" />
      <div
        class={[
          // general styles
          'z-10 bg-black/50 text-white text-center py-1 px-2 rounded-md',
          // animation
          // 'opacity-0 transition-opacity', // curently not working
        ]}
      >
        {tooltip}
      </div>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>