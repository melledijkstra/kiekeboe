import { writable, type Writable } from 'svelte/store'

export interface IExport<T> {
  subscribe: Writable<T[]>['subscribe']
  set: Writable<T[]>['set']
  initialize(): Promise<void>
  add(item: T): Promise<void>
  remove(id: string): Promise<void>
  update(item: T & { id: string }): Promise<void>
}

export type DBItem<T> = T & { id: string; createdAt: Date; updatedAt: Date }

export class DbStore<T> implements IExport<DBItem<T>> {
  private fetchAll: () => Promise<T[]>
  private addItem: (item: T) => Promise<void>
  private updateItem: (item: T & { id: string }) => Promise<void>
  private deleteItem: (id: string) => Promise<void>
  private store: Writable<DBItem<T>[]>

  public subscribe: Writable<DBItem<T>[]>['subscribe']
  public set: Writable<DBItem<T>[]>['set']

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
    this.store = writable([])
    this.subscribe = this.store.subscribe
    this.set = this.store.set
  }

  async initialize() {
    const items = await this.fetchAll() as (T & { id: string; createdAt: Date; updatedAt: Date })[]
    this.set(items)
  }

  async add(item: T) {
    await this.addItem({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const items = await this.fetchAll() as (T & { id: string; createdAt: Date; updatedAt: Date })[]
    this.set(items)
  }

  async remove(id: string) {
    await this.deleteItem(id)
    this.store.update(items => items.filter(item => item.id !== id))
  }

  async update(updatedItem: T & { id: string }) {
    const updatedAt = new Date()
    await this.updateItem({
      ...updatedItem,
      updatedAt
    })
    this.store.update(items =>
      items.map(item =>
        item.id === updatedItem.id
          ? { ...item, ...updatedItem, updatedAt }
          : item
      )
    )
  }
}
