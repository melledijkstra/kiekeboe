import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTimePercentage } from './utils'

describe('time/utils.ts', () => {
  describe('getTimePercentage', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return 0% at 00:00', () => {
      vi.setSystemTime(new Date(2024, 0, 1, 0, 0))
      expect(getTimePercentage()).toBe('0%')
    })

    it('should return 25% at 06:00', () => {
      vi.setSystemTime(new Date(2024, 0, 1, 6, 0))
      expect(getTimePercentage()).toBe('25%')
    })

    it('should return 50% at 12:00', () => {
      vi.setSystemTime(new Date(2024, 0, 1, 12, 0))
      expect(getTimePercentage()).toBe('50%')
    })

    it('should return 75% at 18:00', () => {
      vi.setSystemTime(new Date(2024, 0, 1, 18, 0))
      expect(getTimePercentage()).toBe('75%')
    })

    it('should return 100% at 23:59', () => {
      vi.setSystemTime(new Date(2024, 0, 1, 23, 59))
      expect(getTimePercentage()).toBe('100%')
    })

    it('should handle rounding correctly (e.g., 08:30)', () => {
      // (8 * 60 + 30) / 1440 = 510 / 1440 = 0.354166...
      // 0.354166... * 100 = 35.4166... -> 35%
      vi.setSystemTime(new Date(2024, 0, 1, 8, 30))
      expect(getTimePercentage()).toBe('35%')
    })

    it('should handle rounding correctly (e.g., 08:45)', () => {
      // (8 * 60 + 45) / 1440 = 525 / 1440 = 0.364583...
      // 0.364583... * 100 = 36.4583... -> 36%
      vi.setSystemTime(new Date(2024, 0, 1, 8, 45))
      expect(getTimePercentage()).toBe('36%')
    })
  })
})
