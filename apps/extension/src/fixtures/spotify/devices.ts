import type { Device } from 'SpotifyApi'

export const devices: Device[] = [
  {
    id: 'd90f9f5560d3a2202002d3db72668441321e5db6',
    is_active: false,
    is_private_session: false,
    is_restricted: false,
    name: 'Iphone',
    type: 'Smartphone',
    volume_percent: 70,
    supports_volume: false
  },
  {
    id: '12005cbac470147c83e6070709ea78f43c4254a2',
    is_active: true,
    is_private_session: false,
    is_restricted: false,
    name: 'Web Player (Spotify)',
    type: 'Computer',
    volume_percent: 34,
    supports_volume: true
  }
]
