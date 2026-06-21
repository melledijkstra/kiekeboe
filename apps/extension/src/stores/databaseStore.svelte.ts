import { SvelteDate } from "svelte/reactivity"

export interface IExport<T> {
  readonly items: T[]
  initialize(): Promise<void>
  add(item: T): Promise<void>
  remove(id: string): Promise<void>
  update(item: T & { id: string }): Promise<void>
}

export type DBItem<T> = T & { id: string; createdAt: SvelteDate; updatedAt: SvelteDate }

export class DbStore<T> implements IExport<DBItem<T>> {
  private fetchAll: () => Promise<T[]>
  private addItem: (item: T) => Promise<void>
  private updateItem: (item: T & { id: string }) => Promise<void>
  private deleteItem: (id: string) => Promise<void>
  
  private _items = $state<DBItem<T>[]>([])

  get items() {
    return this._items
  }

  constructor(
    fetchAll: () => Promise<T[]>,
    addItem: (item: T) => Promise<void>,
    updateItem: (item: T & { id: string }) => Promise<void>,
    deleteItem: (id: string) => Promise<void>
  ) {
    this.fetchAll = fetchAll
    this.addItem = addItem
    this.updateItem = updateItem
    this.deleteItem = deleteItem
  }

  async initialize() {
    const items = await this.fetchAll() as DBItem<T>[]
    this._items = items
  }

  async add(item: T) {
    await this.addItem({
      ...item,
      createdAt: new SvelteDate(),
      updatedAt: new SvelteDate()
    })
    const items = await this.fetchAll() as DBItem<T>[]
    this._items = items
  }

  async remove(id: string) {
    await this.deleteItem(id)
    const index = this._items.findIndex(item => item.id === id)
    if (index !== -1) {
      this._items.splice(index, 1)
    }
  }

  async update(updatedItem: T & { id: string }) {
    const updatedAt = new SvelteDate()
    await this.updateItem({
      ...updatedItem,
      updatedAt
    })
    const index = this._items.findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      this._items[index] = { ...this._items[index], ...updatedItem, updatedAt }
    }
  }
}
