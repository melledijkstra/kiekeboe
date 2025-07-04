import type { Device, Track, PlaybackState, Playlist } from 'SpotifyApi';

type SpotifyState = {
  token: string | null;
  isAuthenticated: boolean;
  tracks: Track[];
  playlists: Playlist[];
  playbackState: PlaybackState | null;
  position: number; // Position in milliseconds
  devices: Device[]; // List of available devices
}

export const spotifyState = $state<SpotifyState>({
  token: null,
  isAuthenticated: false,
  playbackState: null,
  position: 0,
  devices: [],
  tracks: [],
  playlists: []
});
