import type { Playlist, PlaybackState } from "MusicPlayer"

export type MusicPlayerState = {
  playback: PlaybackState,
  selectedPlaylist?: Playlist,
  playlists: Playlist[]
}

export const MPState = $state<MusicPlayerState>({
  playback: {
    isPlaying: false,
    shuffle: false,
    position_ms: 0,
    currentItem: undefined,
    volume: 0
  },
  playlists: []
})
