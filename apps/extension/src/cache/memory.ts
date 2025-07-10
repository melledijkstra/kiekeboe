import type { ILogger } from '@/interfaces/logger.interface'
import { Logger } from '@/logger'

const logger = new Logger('cache')

type CacheItem<T> = {
  data: T
  timestamp: number
  ttl: number
}

const cache: Record<string, CacheItem<unknown> | undefined> = {}

// Default TTL Times (Time To Live)
export const SEC_30 = 30 * 1000
export const MIN_1 = 1 * 60 * 1000
export const MIN_3 = 3 * 60 * 1000
export const MIN_5 = 5 * 60 * 1000
export const MIN_10 = 10 * 60 * 1000
export const MIN_15 = 15 * 60 * 1000


export function get(key: string) {
  const cachedItem = cache[key]
  if (cachedItem) {
    if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
      delete cache[key]
    } else {
      logger.log('Cache hit:', key)
      return cachedItem.data
    }
  }
}

export function set(key: string, value: unknown, ttl = MIN_5): void {
  cache[key] = {
    data: value,
    timestamp: Date.now(),
    ttl: ttl ?? MIN_5
  }
}

type CacheOptions = {
  key?: string
  ttl?: number
}

/**
 * Curried `withCache`: first call it with your options,
 * then call the returned function with your async function.
 */
export function withCache<T, A extends unknown[]>(
  originalFunc: (...args: A) => Promise<T>,
  options: CacheOptions = {}
): (...args: A) => Promise<T> {
  const defaultTTL = 5 * 60 * 1000 // 5 minutes

  // Return a new function that expects the actual async function
  const cachedFunction = async <T>(...args: A): Promise<T> => {
    const cacheKey = options?.key ?? originalFunc.name
    const cacheTTL = options?.ttl ?? defaultTTL

    // Attempt to get from cache
    const cachedData = get(cacheKey)
    if (cachedData !== undefined) {
      return cachedData as T
    }

    // Otherwise, call the original function, then store and return its result
    const result = (await originalFunc(...args)) as T
    set(cacheKey, result, cacheTTL)
    return result
  }

  return cachedFunction
}

export class MemoryCache implements ILogger {
  logger = new Logger('MemoryCache')
  private cache: Record<string, CacheItem<unknown> | undefined> = {}

  get<T>(key: string): T | undefined {
    const cachedItem = this.cache[key]
    if (!cachedItem) {
      return
    }
    
    if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
      delete this.cache[key]
    } else {
      return cachedItem.data as T
    }
  }
  
  set(key: string, value: unknown, ttl = MIN_5) {
    this.cache[key] = {
      data: value,
      timestamp: Date.now(), // store insertion time
      ttl: ttl ?? MIN_5
    }
  }
}
