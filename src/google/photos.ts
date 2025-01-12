import { log } from '@/logger'
import { getAuthToken } from '../oauth2/auth'

export async function fetchPhotos() {
  const token = await getAuthToken('google')

  fetch('https://photoslibrary.googleapis.com/v1/mediaItems', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      log('Photos:', data.mediaItems)
    })
    .catch((error) => console.error('Error fetching photos:', error))
}
