<script module lang="ts">
  import Card from '@/components/atoms/Card.svelte'
  import Icon from '@/components/atoms/Icon.svelte'
  import Status from '@/components/atoms/Status.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'
  import { mdiPlay, mdiRepeat, mdiShuffle, mdiSkipNext, mdiSkipPrevious, mdiSpotify, mdiWifi } from '@mdi/js'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  
  type Args = {
    items: number
  }

  const { Story } = defineMeta({
    title: 'WidgetGrid',
    args: {
      items: 10
    } satisfies Args
  })

  const spanning: Record<number, string> = {
    1: 'md:col-span-2',
    2: 'md:col-span-1 lg:col-span-2',
    3: 'md:col-span-1 lg:col-span-1',
    4: 'md:col-span-2 lg:col-span-2',
    5: 'md:col-span-1 lg:col-span-2',
    6: 'md:col-span-2 lg:col-span-2',
    7: 'md:col-span-1 lg:col-span-2',
  } as const
</script>

<script lang="ts">
  let status = $state(true)
</script>

<Story name="Default">
  {#snippet template(args)}
    <div class="container mx-auto">
      <div class="grid grid-flow-dense grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center auto-rows-[250px]">
        <Card variant="auto">
          <div class="flex flex-col gap-2 h-full">
            <div class="flex flex-row gap-2 justify-between items-center">
              <button
                class="inline-block p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer"
              >
                <Icon path={mdiWifi} size={20} />
              </button>
              <Status {status} class="mr-4" />
            </div>
            <code class="mt-4 text-base font-bold">WIFI</code>
            <p class="text-sm text-gray-300">
              Connected to: <span class="font-bold">PineappleWifi</span>
            </p>
            <Toggle
              label={status ? 'Turn off' : 'Turn on'}
              bind:checked={status}
              parentClass="float-right mt-auto ml-auto"
            />
          </div>
        </Card>
        <Card variant="auto" class="col-span-1 md:col-span-2">
          <div class="flex flex-col gap-3 justify-between h-full">
            <div class="flex flex-row gap-2 items-center">
              <img
                src="https://i.scdn.co/image/ab67616d0000b27333c6b920eabcf4c00d7a1093"
                alt="Placeholder"
                class="size-15 aspect-square object-cover rounded"
              />
              <div class="ml-2 flex flex-col gap-1">
                <h2 class="text-base font-bold">Love on the Brain</h2>
                <p class="text-sm text-gray-300">Rihanna</p>
              </div>
              <Icon path={mdiSpotify} size={36} class="text-spotify ml-auto" />
            </div>
            <div class="flex flex-row gap-2 items-center w-full">
              <!-- Time Indication -->
              <div class="flex flex-col w-full">
                <div class="flex flex-row justify-between mb-1">
                  <p class="text-sm text-gray-300">1:31</p>
                  <p class="text-sm text-gray-300">3:02</p>
                </div>
                <!-- Progress Bar -->
                <div class="relative w-full h-1 bg-gray-200 rounded-full">
                  <div class="w-1/2 h-full bg-gray-500 rounded-full"></div>
                  <!-- thumb -->
                  <div
                    class="w-2 h-2 bg-gray-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4"
                  ></div>
                </div>
              </div>
            </div>
            <!-- Actions -->
            <div class="flex flex-row gap-2 items-center justify-evenly">
              <Icon path={mdiShuffle} size={20} class="text-gray-300" />
              <Icon path={mdiSkipPrevious} size={20} class="text-gray-300" />
              <div class="text-gray-300 bg-gray-500 rounded-full p-2 cursor-pointer">
                <Icon path={mdiPlay} size={20} />
              </div>
              <Icon path={mdiSkipNext} size={20} class="text-gray-300" />
              <Icon path={mdiRepeat} size={20} class="text-gray-300" />
            </div>
          </div>
        </Card>
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Array(args.items) as _, i (i)}
          <Card variant="auto" class={spanning[i % 7 + 1]}>
            <p>Generated Item {i + 1}</p>
          </Card>
        {/each}
      </div>
    </div>
  {/snippet}
</Story>