<script lang="ts">
  import { Command, Dialog } from 'bits-ui'
  import { log } from '@/logger'
  import { onDestroy, onMount } from 'svelte'
  import Icon from '@/components/atoms/Icon.svelte'
  import { type CommandGroups } from './types'
  import type { CommandServiceInterface } from './CommandServiceInterface'
  import { commandCenterState } from './state.svelte'
  import { mdiYoutube } from '@mdi/js'

  export type CommandCenterProps = {
    commandService: CommandServiceInterface
    forceOpen?: boolean
  }

  const { forceOpen, commandService }: CommandCenterProps = $props()

  let commandRoot: Command.Root | null = $state(null)
  let input = $state('')

  function handleKeypress(event: KeyboardEvent) {
    // Check if metaKey (Mac) or ctrlKey (Windows/Linux) is pressed
    if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
      event.preventDefault() // prevents the browser's print dialog
      commandCenterState.isOpen = !commandCenterState.isOpen
    }

    if (event.key === 'Escape') {
      commandCenterState.isOpen = false
    }
  }

  function removeQueryParam(isOpen: boolean) {
    const url = new URL(window.location.href);
    if (!isOpen && url.searchParams.has("command-center")) {
      log('Removing query param, isOpen:', isOpen)
      url.searchParams.delete("command-center");
      window.history.replaceState({}, '', url.toString());
    }
  }

  onMount(() => {
    if (forceOpen) {
      commandCenterState.isOpen = true
    }

    commandService.initialize()
    const url = new URL(window.location.href);
    if (url.searchParams.get("command-center") === "true") {
      commandCenterState.isOpen = true
    }

    document.addEventListener('command-center:open', () => {
      log('Command center opened via event')
      commandCenterState.isOpen = true
    })

    log('registering command center')
    document.addEventListener('keydown', handleKeypress)
  })

  onDestroy(() => {
    commandCenterState.isOpen = false
    commandService.destroy()
    log('unregistering command center')
    document.removeEventListener('keydown', handleKeypress)
  })
</script>

<Dialog.Root bind:open={commandCenterState.isOpen} onOpenChangeComplete={removeQueryParam}>
  <Dialog.Portal>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/40"
    />
    <Dialog.Content
      class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95  data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[490px] md:w-full"
    >
      <Dialog.Title class="sr-only">Command Menu</Dialog.Title>
      <Dialog.Description class="sr-only">
        This is the command menu. Use the arrow keys to navigate.
      </Dialog.Description>
      <Command.Root
        bind:this={commandRoot}
        id="command-center"
        class={[
          'rounded-xl shadow-md backdrop-blur-xs',
          // dark theme
          'dark:bg-black/60 dark:text-white',
          // light theme
          'bg-white/40 text-black',
          'font-mono flex flex-col h-full w-full divide-y self-start overflow-hidden rounded-xl'
        ]}
      >
        <Command.Input
          id="command-input"
          class="focus-override h-input placeholder:text-zinc-200/50 focus:outline-hidden inline-flex truncate rounded-tl-xl rounded-tr-xl p-4 text-sm transition-colors focus:ring-0"
          placeholder="Type a command..."
          bind:value={input}
        />
        <Command.List
          class="max-h-[300px] overflow-y-auto overflow-x-hidden px-2 pb-2"
        >
          <Command.Viewport>
            <Command.Empty
              class="text-white flex w-full items-center justify-center pb-6 pt-8 text-sm"
            >
              No results found.
            </Command.Empty>
            {#each Object.keys(commandService.commands) as commandGroup, index (commandGroup)}
              {#if index !== 0}
                <Command.Separator class="bg-white/5 h-px w-full" />
              {/if}
              <Command.Group>
                <Command.GroupHeading class="text-white px-3 pb-2 pt-4 text-xs">
                  {commandGroup}
                </Command.GroupHeading>
                <Command.GroupItems>
                  {#each commandService.commands[commandGroup as keyof CommandGroups] as command (command.name)}
                    <Command.Item
                      class="rounded data-selected:bg-zinc-400 outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm"
                      keywords={command.keywords.map((k) => `/${k}`)}
                      onSelect={() => {
                        command.action(input.trim())
                        commandCenterState.isOpen = false
                        input = ''
                      }}
                    >
                      <Icon path={command.icon} class="size-4" />
                      {command.name}
                    </Command.Item>
                  {/each}
                </Command.GroupItems>
              </Command.Group>
            {/each}
            <Command.Separator class="bg-white/5 h-px w-full" />
            <Command.Group>
                <Command.GroupHeading class="text-white px-3 pb-2 pt-4 text-xs">
                  Direct Links
                </Command.GroupHeading>
                <Command.GroupItems>
                    <Command.LinkItem
                      value="youtube"
                      class="rounded-button data-selected:bg-zinc-400 outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm"
                      keywords={['youtube', 'video', 'watch']}
                      href="https://www.youtube.com"
                      target="_blank"
                    >
                      <Icon path={mdiYoutube} class="size-4" />
                      YouTube
                    </Command.LinkItem>
                </Command.GroupItems>
              </Command.Group>
          </Command.Viewport>
        </Command.List>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
