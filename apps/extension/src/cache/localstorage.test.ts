import { describe, expect, it } from "vitest"
import { LocalStorageAdapter } from "./localstorage"

describe('LocalStorageAdapter', () => {
  it('should set and get parsed values', () => {
    const adapter = new LocalStorageAdapter()
    adapter.set('foo', { a: 1 })
    expect(adapter.get('foo')).toEqual({ a: 1 })
  })

  it('should return null for non-existent key', () => {
    const adapter = new LocalStorageAdapter()
    expect(adapter.get('nonexistent')).toBeNull()
  })

  it('should delete keys correctly', () => {
    const adapter = new LocalStorageAdapter()
    adapter.set('foo', 'bar')
    adapter.delete('foo')
    expect(adapter.get('foo')).toBeNull()
  })

  it('should clear all keys', () => {
    const adapter = new LocalStorageAdapter()
    adapter.set('foo', 'bar')
    adapter.clear()
    expect(adapter.get('foo')).toBeNull()
  })
})
