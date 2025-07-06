import type { State, Playlist } from "MusicPlayer"

type MusicPlayerState = {
  state: State,
  selectedPlaylist?: Playlist,
  playlists: Playlist[]
}

export const MPState = $state<MusicPlayerState>({
  state: {
    isPlaying: false,
    shuffle: false,
    position_ms: 0,
    currentItem: undefined,
    volume: 0
  },
  playlists: []
})
