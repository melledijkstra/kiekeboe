<script lang="ts">
  import type { Playlist } from 'MusicPlayer'

  const {
    playlist,
    onPlaylistPlay,
    onPlaylistSelected
  }: {
    playlist: Playlist
    onPlaylistPlay: (playlist: Playlist) => void
    onPlaylistSelected: (playlist: Playlist) => void
  } = $props()
</script>

<div
  class="flex flex-row text-left w-full items-center p-2 hover:bg-neutral-400 rounded-sm transition text-white"
>
  <button
    class="cursor-pointer hover:opacity-30"
    onclick={() => onPlaylistPlay(playlist)}
  >
    <img
      class="size-10"
      src={playlist.coverArtUrl ?? '/icons/album-cover-placeholder.png'}
      alt="Playlist cover"
    />
  </button>
  <div class="flex flex-col ml-2 overflow-hidden">
    <button
      class="truncate hover:underline cursor-pointer"
      onclick={() => onPlaylistSelected(playlist)}>{playlist.title}</button
    >
    <p>{playlist.tracks.length} songs</p>
  </div>
</div>
