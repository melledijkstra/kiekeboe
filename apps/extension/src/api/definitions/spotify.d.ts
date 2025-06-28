export type Device = {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
  supports_volume: boolean
}

export type Image = {
  height: number | null,
  url: string,
  width: number | null
}

export type User = {
  display_name: string,
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  type: "user",
  uri: string
}

export type Playlist = {
  collaborative: boolean,
  description: string,
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  images: Array<Image>,
  name: string,
  owner: User,
  primary_color: string | null,
  public: boolean,
  snapshot_id: string,
  tracks: {
    href: string,
    total: number
  },
  type: "playlist",
  uri: string
}

export type PlaybackState = {
  "device": Device,
  "repeat_state": string,
  "shuffle_state": boolean,
  "context": {
    "type": "string",
    "href": "string",
    "external_urls": {
      "spotify": "string"
    },
    "uri": "string"
  },
  "timestamp": 0,
  "progress_ms": 0,
  "is_playing": false,
  "item": {
    "album": {
      "album_type": "compilation",
      "total_tracks": 9,
      "available_markets": [
        "CA",
        "BR",
        "IT"
      ],
      "external_urls": {
        "spotify": "string"
      },
      "href": "string",
      "id": "2up3OPMp9Tb4dAKM2erWXQ",
      "images": [
        {
          "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
          "height": 300,
          "width": 300
        }
      ],
      "name": "string",
      "release_date": "1981-12",
      "release_date_precision": "year",
      "restrictions": {
        "reason": "market"
      },
      "type": "album",
      "uri": "spotify:album:2up3OPMp9Tb4dAKM2erWXQ",
      "artists": [
        {
          "external_urls": {
            "spotify": "string"
          },
          "href": "string",
          "id": "string",
          "name": "string",
          "type": "artist",
          "uri": "string"
        }
      ]
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "string"
        },
        "href": "string",
        "id": "string",
        "name": "string",
        "type": "artist",
        "uri": "string"
      }
    ],
    "available_markets": [
      "string"
    ],
    "disc_number": 0,
    "duration_ms": 0,
    "explicit": false,
    "external_ids": {
      "isrc": "string",
      "ean": "string",
      "upc": "string"
    },
    "external_urls": {
      "spotify": "string"
    },
    "href": "string",
    "id": "string",
    "is_playable": false,
    "linked_from": {},
    "restrictions": {
      "reason": "string"
    },
    "name": "string",
    "popularity": 0,
    "preview_url": "string",
    "track_number": 0,
    "type": "track",
    "uri": "string",
    "is_local": false
  },
  "currently_playing_type": "string",
  "actions": {
    "interrupting_playback": false,
    "pausing": false,
    "resuming": false,
    "seeking": false,
    "skipping_next": false,
    "skipping_prev": false,
    "toggling_repeat_context": false,
    "toggling_shuffle": false,
    "toggling_repeat_track": false,
    "transferring_playback": false
  }
}
