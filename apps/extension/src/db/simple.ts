import { dbPromise, storeInDB } from '@/db'
import type { StoreNames, StoreValue } from 'idb'
import type { PersonalExtensionDB } from './index'

export async function addItem<DBName extends StoreNames<PersonalExtensionDB>>(
  dbName: DBName,
  item: StoreValue<PersonalExtensionDB, DBName>
) {
  await storeInDB(dbName, item)
}

export async function getAllItems<DBName extends StoreNames<PersonalExtensionDB>>(
  dbName: DBName
): Promise<StoreValue<PersonalExtensionDB, DBName>[]> {
  const db = await dbPromise
  return await db.getAll(dbName)
}
