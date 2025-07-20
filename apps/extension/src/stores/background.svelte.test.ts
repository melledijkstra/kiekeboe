import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { backgroundImage, setBackgroundImage } from './background.svelte'
import type { Readable } from 'svelte/store'

// Helper to subscribe and capture value
function getStoreValue(store: Readable<string | undefined>): string | undefined {
  let value: string | undefined
  const unsub = store.subscribe((v) => (value = v))
  unsub()
  return value
}

describe('background store', () => {
  let originalImage: typeof globalThis.Image

  beforeEach(() => {
    originalImage = globalThis.Image
    vi.stubGlobal('Image', class {
      _src: string = ''
      get src() {
        return this._src
      }
      set src(value: string) {
        this._src = value
        setTimeout(() => {
          this.onload?.()
        }, 0)
      }
      onload: (() => void) | null = null
      onerror: ((error: Event) => void) | null = null
    })
  })

  afterEach(() => {
    globalThis.Image = originalImage
    vi.unstubAllGlobals()
  })

  it('should have undefined as initial value', () => {
    expect(getStoreValue(backgroundImage)).toBeUndefined()
  })

  it('should update store when setBackgroundImage is called with a valid URL', async () => {
    const url = 'https://example.com/image.jpg'
    let value: string | undefined
    const unsub = backgroundImage.subscribe((v) => (value = v))
    await setBackgroundImage(url)
    expect(value).toBe(url)
    unsub()
  })

  it('should allow multiple subscribers to receive updates', async () => {
    const url = 'https://example.com/image2.jpg'
    let value1: string | undefined
    let value2: string | undefined
    const unsub1 = backgroundImage.subscribe((v) => (value1 = v))
    const unsub2 = backgroundImage.subscribe((v) => (value2 = v))
    await setBackgroundImage(url)
    expect(value1).toBe(url)
    expect(value2).toBe(url)
    unsub1()
    unsub2()
  })
}) 