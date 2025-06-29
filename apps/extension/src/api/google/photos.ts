import { log } from '@/logger'
import { AuthClient } from '@/oauth2/auth'
import { GoogleAuthProvider } from '@/oauth2/providers'

export async function fetchPhotos() {
  const client = new AuthClient(new GoogleAuthProvider())
  const token = client.getAuthToken()

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
