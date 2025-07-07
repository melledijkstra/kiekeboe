import type { State } from "MusicPlayer";
import { defaultTrack } from "./track";

export const playbackState: State = {
  currentItem: defaultTrack,
  isPlaying: true,
  volume: 50, // 0-100
  position_ms: 3000, // in milliseconds
  shuffle: false
}