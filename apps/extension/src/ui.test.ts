import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getMomentOfDay } from './ui'
import { setBackgroundImage, backgroundImage } from './stores/background.svelte'

describe('ui.ts', () => {
  describe('getMomentOfDay', () => {
    it('should return a morning message if the time is before 12 PM', () => {
      vi.setSystemTime(new Date('2023-01-01T08:00:00Z'))
      const result = getMomentOfDay()
      expect(result).toBe('morning')
    })

    it('should return an afternoon message if the time is between 12 PM and 6 PM', () => {
      vi.setSystemTime(new Date('2023-01-01T14:00:00Z'))
      const result = getMomentOfDay()
      expect(result).toBe('afternoon')
    })

    it('should return an evening message if the time is after 6 PM', () => {
      vi.setSystemTime(new Date('2023-01-01T19:00:00Z'))
      const result = getMomentOfDay()
      expect(result).toBe('evening')
    })
  })

  describe('setBackgroundImage', () => {
    let originalImage: typeof globalThis.Image;

    beforeEach(() => {
      originalImage = globalThis.Image;
      vi.stubGlobal('Image', class {
        _src: string = '';
        get src() {
          return this._src;
        }
        set src(value: string) {
          this._src = value;
          // Simulate image loading
          setTimeout(() => {
            this.onload?.();
          }, 0);
        }
        onload: (() => void) | null = vi.fn();
        onerror: ((error: Event) => void) | null = vi.fn();
      })
    })

    afterEach(() => {
      globalThis.Image = originalImage;
      vi.unstubAllGlobals();
    })

    it('should set the background image', async () => {
      // setup
      const mockUrl = 'https://example.com/image.jpg'
      let result: string | undefined
      const unsub = backgroundImage.subscribe((v) => (result = v))

      await setBackgroundImage(mockUrl)

      expect(result).toBe(mockUrl)
      unsub()
    })
  })
})