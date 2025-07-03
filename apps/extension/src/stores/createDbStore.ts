import { writable, type Writable } from 'svelte/store'

export function createDbStore<T>(
  fetchAll: () => Promise<T[]>,
  addItem: (item: T) => Promise<void>
) {
  const { subscribe, set, update }: Writable<T[]> = writable([])

  async function initialize() {
    const items = await fetchAll()
    set(items)
  }

  async function add(item: T) {
    await addItem(item)
    const items = await fetchAll()
    set(items)
  }

  return {
    subscribe,
    set,
    update,
    initialize,
    add
  }
}
