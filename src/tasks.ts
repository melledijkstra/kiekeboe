import { getAuthToken } from './google/auth'
import { log } from './logger'

export type Task = {
  id: string
  kind?: string
  links?: string[]
  position?: string
  selfLink?: string
  status?: 'needsAction'
  title: string
  updated?: string
  webViewLink?: string
}

export async function fetchTasks(): Promise<Task[] | undefined> {
  try {
    const token = await getAuthToken()
    const response = await fetch(
      'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = (await response.json()) as { items: Task[] }
    log('Tasks:', data)

    return data.items
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}
