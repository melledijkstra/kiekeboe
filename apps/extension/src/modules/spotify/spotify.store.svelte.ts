import type { Device, Track, PlaybackState, Playlist } from 'SpotifyApi';

type SpotifyState = {
  token?: string;
  isAuthenticated: boolean;
  tracks: Track[];
  playlists: Playlist[];
  playbackState?: PlaybackState;
  position: number; // Position in milliseconds
  devices: Device[]; // List of available devices
}

export const spotifyState = $state<SpotifyState>({
  isAuthenticated: false,
  position: 0,
  devices: [],
  tracks: [],
  playlists: []
});
