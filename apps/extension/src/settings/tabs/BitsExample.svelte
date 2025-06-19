<script lang="ts">
  import Icon from "@/components/atoms/Icon.svelte"
  import { mdiPanHorizontal, mdiSquare } from "@mdi/js"
  import { Accordion, Popover, Separator, Toggle } from "bits-ui";

  let width = $state(1024);
  let height = $state(768);
</script>
 
<Accordion.Root type="single" class="mx-auto w-full max-w-md">
  <Accordion.Item class="mb-2 rounded-md border border-zinc-700">
    <Accordion.Header class="bg-gray-700 transition-colors hover:bg-gray-700">
      <Accordion.Trigger
        class="flex w-full items-center justify-between p-4 text-left font-medium"
      >
        <span>Tailwind-styled Accordion</span>
        <svg
          class="h-5 w-5 transform transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content class="p-4 text-gray-100">
      This accordion is styled using Tailwind CSS classes.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
 
<Popover.Root>
  <Popover.Trigger
    class="rounded-input bg-zinc-200
	text-zinc-800 shadow-sm hover:bg-zinc-600/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
  >
    Resize
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      class="border-zinc-700 bg-zinc-200 shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-popover-content-transform-origin) z-30 w-full max-w-[328px] rounded-[12px] border p-4"
      sideOffset={8}
    >
      <div class="flex items-center">
        <div
          class="bg-amber-300 mr-3 flex size-12 items-center justify-center rounded-full"
        >
          <Icon path={mdiSquare} class="size-6" />
        </div>
        <div class="flex flex-col">
          <h4 class="text-[17px] font-semibold leading-5 tracking-[-0.01em]">
            Resize image
          </h4>
          <p class="text-muted-foreground text-sm font-medium">
            Resize your photos easily
          </p>
        </div>
      </div>
      <Separator.Root class="bg-zinc-700 -mx-4 mb-6 mt-[17px] block h-px" />
      <div class="flex items-center pb-2">
        <div class="mr-2 flex items-center">
          <div class="relative mr-2">
            <span class="sr-only">Width</span>
            <span
              aria-hidden="true"
              class="text-xs text-muted-foreground absolute left-5 top-4"
              >W</span
            >
            <input
              type="number"
              class="h-input rounded-[10px] border-border-input bg-background text-foreground w-[119px] border pl-10 pr-2 text-base sm:text-sm"
              bind:value={width}
            />
          </div>
          <div class="relative">
            <span class="sr-only">Height</span>
            <span
              aria-hidden="true"
              class="text-xs text-muted-foreground absolute left-5 top-4"
              >H</span
            >
            <input
              type="number"
              class="h-input rounded-10px border-border-input bg-background text-foreground w-[119px] border pl-10 pr-2 text-base sm:text-sm"
              bind:value={height}
            />
          </div>
        </div>
        <Toggle.Root
          aria-label="toggle constrain portions"
          class="bg-background hover:bg-muted data-[state=on]:bg-muted inline-flex size-10 items-center justify-center rounded-[9px] transition-all active:scale-[0.98]"
        >
          <Icon path={mdiPanHorizontal} class="size-6" />
        </Toggle.Root>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
