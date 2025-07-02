import type { TaskList, Task } from '@/api/definitions/google'
import { TokenBaseClient } from '../tokenbaseclient'

const BASE_URL = 'https://tasks.googleapis.com/tasks/v1'

export class TasksClient extends TokenBaseClient {
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

  async setTaskStatus(
    task: string | Task,
    status: Task['status'] = 'completed',
    taskListId?: string
  ): Promise<Task | undefined> {
    const id = typeof task === 'string' ? task : task.id
    const taskData: Partial<Task> = {
      status
    }
    try {
      const response = await this.request<Task>(
        `/lists/${taskListId ?? '@default'}/tasks/${id}?alt=json`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'PATCH',
          body: JSON.stringify(taskData)
        }
      )

      if (response) {
        return response
      }
    } catch (error) {
      console.error('Error completing task', error)
    }
  }

  async updateTask(task: Task) {
    throw new Error('Update Task not implemented yet!' + task.id)
  }

  async createTask(
    title: string,
    taskListId?: string
  ): Promise<Task | undefined> {
    const taskData = JSON.stringify({ title })
    try {
      const response = await this.request<Task>(
        `/lists/${taskListId ?? '@default'}/tasks`,
        {
          method: 'POST',
          body: taskData
        }
      )

      if (response) {
        return response
      }
    } catch (error) {
      console.error('Error creating a task', error)
    }
  }
}
