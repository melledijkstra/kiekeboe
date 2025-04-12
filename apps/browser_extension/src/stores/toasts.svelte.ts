import { writable } from 'svelte/store'

export type Toast = {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
}

export const toasts = writable<Array<Toast>>([])

export function addToast(
  message: string,
  type: Toast['type'] = 'info',
  duration = 3000
) {
  const id = Date.now()
  toasts.update((current) => [...current, { id, message, type }])

  setTimeout(() => {
    toasts.update((current) => current.filter((toast) => toast.id !== id))
  }, duration)
}
