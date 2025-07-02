import { dbPromise, storeInDB } from '@/db'
import { log } from '@/logger'

export type FocusSession = {
  topic?: string
  startDateTime: Date
  endDateTime: Date
  // in minutes
  totalDuration: number
  habitId?: number
  taskId?: string
  tags?: string[]
}

export async function storeFocusSession(session: FocusSession) {
  log('Storing focus session', session)
  await storeInDB('focus', session)
}

export async function getAllFocusSessions(): Promise<FocusSession[]> {
  const db = await dbPromise
  return await db.getAll('focus')
}
