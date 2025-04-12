import { AuthClient } from '@/oauth2/auth'

export type Account = {
  name: string
  picture: string
  email: string
}

const client = new AuthClient('google')

export async function fetchAccountInfo() {
  try {
    const token = client.getAuthToken()
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

    return data
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}
