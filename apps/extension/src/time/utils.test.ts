import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatSeconds, getTimePercentage, millisecondsToTime } from './utils'

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
    });
  })

  describe('formatSeconds', () => {
    it('should format 0 seconds as "0:00"', () => {
      expect(formatSeconds(0)).toBe('0:00')
    })

    it('should format seconds less than a minute', () => {
      expect(formatSeconds(45)).toBe('0:45')
    })

    it('should format exactly one minute', () => {
      expect(formatSeconds(60)).toBe('1:00')
    })

    it('should format more than a minute', () => {
      expect(formatSeconds(75)).toBe('1:15')
    })

    it('should format multiple minutes', () => {
      expect(formatSeconds(600)).toBe('10:00')
    })

    it('should handle large number of seconds', () => {
      expect(formatSeconds(3661)).toBe('61:01')
    })

    it('should handle fractional seconds', () => {
      // Current implementation returns "0:1.5" for 1.5s, which is inconsistent with millisecondsToTime
      expect(formatSeconds(1.5)).toBe('0:01')
    })

    it('should handle negative seconds', () => {
      // Current implementation returns "-1:-5" for -5s, which is likely a bug
      expect(formatSeconds(-5)).toBe('-0:05')
    })
  })

  describe('millisecondsToTime', () => {
    it('should format 0 milliseconds as "0:00"', () => {
      expect(millisecondsToTime(0)).toBe('0:00')
    })

    it('should format milliseconds less than a second', () => {
      expect(millisecondsToTime(500)).toBe('0:00')
    })

    it('should format milliseconds more than a second', () => {
      expect(millisecondsToTime(1500)).toBe('0:01')
    })

    it('should format milliseconds exactly one minute', () => {
      expect(millisecondsToTime(60000)).toBe('1:00')
    })

    it('should format milliseconds more than a minute', () => {
      expect(millisecondsToTime(75000)).toBe('1:15')
    })
  })
})
