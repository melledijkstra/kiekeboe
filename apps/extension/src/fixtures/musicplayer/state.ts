import type { State } from "MusicPlayer";
import { defaultTrack } from "./tracks";

export const playbackState: State = {
  currentItem: defaultTrack,
  isPlaying: false,
  volume: 50, // 0-100
  position_ms: 0, // in milliseconds
  shuffle: false
}