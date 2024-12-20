import { getAuthToken } from '../auth'

export type Account = {
  name: string
  picture: string
  email: string
}

export async function fetchAccountInfo() {
  try {
    const token = await getAuthToken()
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
    console.log('Profile Image URL:', data.picture)

    return data
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}
