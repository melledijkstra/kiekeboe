import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { retrieveUsername, storeUsername, getWelcomeMessage, setBackgroundImage } from './ui'
import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants';

const fakeStorage = vi.mocked(browser.storage.sync);

describe('ui.ts', () => {
  describe('retrieveUsername', () => {
    it('should retrieve the username from storage', async () => {
      const mockName = 'John Doe'
      fakeStorage.get.mockResolvedValue({ [NAME_STORAGE_KEY]: mockName })

      const result = await retrieveUsername()

      expect(fakeStorage.get).toHaveBeenCalledWith(NAME_STORAGE_KEY)
      expect(result).toBe(mockName)
    })
  })

  describe('storeUsername', () => {
    it('should store the username in storage', async () => {
      const mockName = 'Jane Doe'

      await storeUsername(mockName)

      expect(fakeStorage.set).toHaveBeenCalledWith({ [NAME_STORAGE_KEY]: mockName })
    })
  })

  describe('getWelcomeMessage', () => {
    it('should return a morning message if the time is before 12 PM', () => {
      vi.setSystemTime(new Date('2023-01-01T08:00:00Z'))
      const result = getWelcomeMessage('John')
      expect(result).toBe('Good morning, John')
    })

    it('should return an afternoon message if the time is between 12 PM and 6 PM', () => {
      vi.setSystemTime(new Date('2023-01-01T14:00:00Z'))
      const result = getWelcomeMessage('John')
      expect(result).toBe('Good afternoon, John')
    })

    it('should return an evening message if the time is after 6 PM', () => {
      vi.setSystemTime(new Date('2023-01-01T19:00:00Z'))
      const result = getWelcomeMessage('John')
      expect(result).toBe('Good evening, John')
    })
  })

  describe('updateBackgroundImage', () => {
    let originalImage: typeof globalThis.Image;

    beforeEach(() => {
      originalImage = globalThis.Image;
      vi.stubGlobal('Image', class {
        _src: string = '';
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
      document.documentElement.style.removeProperty('--background-image');
      vi.unstubAllGlobals();
    })

    it('should update the background image', async () => {
      // setup
      const mockUrl = 'https://example.com/image.jpg'
      const mockRootElement = document.createElement('div')
      mockRootElement.style.setProperty = vi.fn()
      document.querySelector = vi.fn().mockReturnValue(mockRootElement)

      // act
      await setBackgroundImage(mockUrl)

      // assert
      expect(mockRootElement.style.setProperty).toHaveBeenCalledWith('--background-image', `url(${mockUrl})`)
    })
  })
})