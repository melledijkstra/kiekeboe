<script lang="ts">
  import type { Snippet } from 'svelte'
  import { DropdownMenu, type WithoutChild } from 'bits-ui'

  type DropdownMenuProps = DropdownMenu.Props & {
    open?: boolean
    items: {
      label: string
      onSelect: (label: string) => void
    }[]
    children: Snippet
    triggerProps?: WithoutChild<DropdownMenu.Trigger.Props>
    contentProps?: WithoutChild<DropdownMenu.Content.Props>
  }

  let {
    open = $bindable(false),
    items,
    children,
    triggerProps,
    contentProps,
    heading,
    ...restProps
  }: DropdownMenuProps = $props()
</script>

<DropdownMenu.Root bind:open {...restProps}>
  <DropdownMenu.Trigger {...triggerProps}>
    {@render children()}
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      {...contentProps}
      class="bg-black p-1 rounded z-50"
    >
      <DropdownMenu.Group class="flex flex-col gap-1">
        {#if heading}
          <DropdownMenu.GroupHeading class="text-gray-400 text-xs"
            >{heading}</DropdownMenu.GroupHeading
          >
        {/if}
        {#each items as item (item.label)}
          <DropdownMenu.Item
            textValue={item.label}
            onSelect={() => item.onSelect(item.label)}
            class="text-white cursor-pointer hover:bg-gray-500 rounded p-1"
          >
            {item.label}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
