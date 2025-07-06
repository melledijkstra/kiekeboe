import type { Device } from 'SpotifyApi';

type SpotifyState = {
  token?: string;
  devices: Device[]; // List of available devices
  deviceId?: string; // Device ID of Web SDK Player
}

export const spotifyState = $state<SpotifyState>({
  devices: [],
});
