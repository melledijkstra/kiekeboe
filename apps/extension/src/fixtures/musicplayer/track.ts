import type { Track } from "MusicPlayer";
import { defaultArtist } from "./artist";

export const defaultTrack: Track = {
  id: "default-track-id",
  title: "Default Track Name",
  artist: defaultArtist,
  album: {
    id: "default-album-id",
    title: "Default Album Name",
    artist: defaultArtist
  },
  duration_ms: 180000, // 3 minutes
}