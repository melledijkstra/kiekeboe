import { singleTrack } from "./tracks";

export const playbackState: Spotify.PlaybackState = {
  context: {
    metadata: null,
    uri: null
  },
  disallows: {},
  duration: 0,
  paused: false,
  position: 0,
  loading: false,
  timestamp: 0,
  repeat_mode: 0,
  shuffle: false,
  restrictions: {},
  track_window: {
    current_track: singleTrack,
    next_tracks: [],
    previous_tracks: []
  },
  playback_id: '',
  playback_quality: '',
  playback_features: {
    hifi_status: ''
  }
}
