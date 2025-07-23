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

/**
 * @param message the message of the notification
 * @param type the type of the notification
 */
export function addNotification(
  message: string,
  type?: 'info' | 'success' | 'error'
): void;

/**
 * @param notification the notification to add
 */
export function addNotification(
  notification: Omit<Notification, 'id'>
): void;

export function addNotification(
  messageOrNotification: string | Omit<Notification, 'id'>,
  type?: 'info' | 'success' | 'error'
): void {
  let notification: Omit<Notification, 'id'>;
  if (typeof messageOrNotification === 'string') {
    const message = messageOrNotification
    notification = {
      message: message,
      type: type ?? 'info',
      duration: 3000,
    };
  } else {
    notification = {
      ...messageOrNotification,
      type: messageOrNotification.type ?? 'info',
      duration: messageOrNotification.duration ?? 3000,
    };
  }

  // Unique ID based on timestamp and random number
  const id = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  notifications.update((current) => [
    ...current,
    { ...notification, id },
  ]);

  setTimeout(() => {
    removeNotification(id);
  }, notification.duration);
}

export function removeNotification(id: string) {
  notifications.update((current) => current.filter((toast) => toast.id !== id))
}
