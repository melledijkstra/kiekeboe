import { writable } from 'svelte/store'

export type Notification = {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
  title?: string
  icon?: string
  duration?: number
}

export const notifications = writable<Array<Notification>>([])

export function addNotification(
  message: string,
  title?: string,
  icon?: string,
  type: Notification['type'] = 'info',
  duration = 3000
) {
  const id = `${Date.now()}_${Math.floor(Math.random() * 1000)}` // Unique ID based on timestamp and random number
  notifications.update((current) => [...current, { id, title, message, icon, type, duration }])

  setTimeout(() => {
    removeNotification(id)
  }, duration)
}

export function removeNotification(id: string) {
  notifications.update((current) => current.filter((toast) => toast.id !== id))
}
