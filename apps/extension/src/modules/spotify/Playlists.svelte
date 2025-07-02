<script lang="ts">
  import type { Playlist } from "@/api/definitions/spotify"
  import type { SpotifyController } from "@/controllers/SpotifyController"
  import { onMount } from "svelte"

  const { controller }: { controller?: SpotifyController } = $props()

  let playlists = $state<Array<Playlist>>()

  onMount(async () => {
    try {
      playlists = await controller?.api?.userPlaylists()
    } catch (error) {
      console.error("Failed to fetch playlists:", error)
    }
  })
</script>

<div class="p-4 overflow-y-auto">
  <h1 class="text-2xl font-bold mb-4">Your Playlists</h1>
  {#if playlists?.length}
    <ul class="space-y-2 h-full overflow-y-auto">
      {#each playlists as playlist (playlist.id)}
        <li>
          <button
            class={[
              "flex items-center",
              "p-4 bg-gray-600 rounded shadow hover:bg-gray-500 transition cursor-pointer"
            ]}
            onclick={() => {
              // Handle playlist click, e.g., navigate to playlist details
              console.log(`Clicked on playlist: ${playlist.name}`)
              controller?.api?.startPlayback(playlist.uri)
            }}
          >
            <img
              src={playlist.images[0]?.url || '/placeholder.png'}
              alt={playlist.name}
              class="w-12 h-12 rounded mr-4"
            />
            <div>
              <h2 class="text-lg font-semibold">{playlist.name}</h2>
              <p class="text-sm text-white">{playlist.tracks.total} tracks</p>
            </div>
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-white">No playlists found.</p>
  {/if}
</div>
