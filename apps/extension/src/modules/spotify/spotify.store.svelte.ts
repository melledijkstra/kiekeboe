import type { Device } from '@/api/definitions/spotify';

type SpotifyState = {
  token: string | null;
  isAuthenticated: boolean;
  playbackState: Spotify.PlaybackState | null;
  position: number; // Position in milliseconds
  devices: Device[]; // List of available devices
}

export const spotifyState = $state<SpotifyState>({
  token: null,
  isAuthenticated: false,
  playbackState: null,
  position: 0,
  devices: [],
});
