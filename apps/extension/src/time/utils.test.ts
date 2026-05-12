import { describe, it, expect } from 'vitest'
import { formatSeconds, millisecondsToTime } from './utils'

describe('time/utils.ts', () => {
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
