import { log } from '@/logger'
import { getAuthToken } from '../oauth2/auth'

export type Account = {
  name: string
  picture: string
  email: string
}

export async function fetchAccountInfo() {
  try {
    const token = await getAuthToken('google')
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = (await response.json()) as Account
    log('Profile Image URL:', data.picture)

    return data
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}
