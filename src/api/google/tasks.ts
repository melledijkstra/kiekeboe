import { BaseClient } from '../baseclient'
import type { TaskList, Task } from '@/api/definitions/google'

const BASE_URL = 'https://tasks.googleapis.com/tasks/v1'

export class TasksClient extends BaseClient {
  public taskLists: TaskList[] = []
  public tasks: Task[] = []

  constructor(token: string) {
    super(BASE_URL, token)
  }

  async fetchTasks(taskListId?: string): Promise<Task[] | undefined> {
    try {
      const response = await this.request<{ items: Task[] }>(
        `/lists/${taskListId ?? '@default'}/tasks`
      )

      return response?.items ?? []
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  async getTaskLists(): Promise<TaskList[] | undefined> {
    try {
      const response = await this.request<{ items: TaskList[] }>(
        '/users/@me/lists'
      )

      return response?.items ?? []
    } catch (error) {
      console.error('Error fetching task lists:', error)
    }
  }
}
