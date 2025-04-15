import { Logger } from '@/logger'

const logger = new Logger('cache')

type CacheItem = {
  data: unknown
  timestamp: number
  ttl: number
}

const cache: Record<string, CacheItem | undefined> = {}

// For a five-minute TTL (Time To Live)
const MIN_5 = 5 * 60 * 1000 // 5 minutes in milliseconds

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

export function set(key: string, value: unknown, ttl = MIN_5) {
  cache[key] = {
    data: value,
    timestamp: Date.now(), // store insertion time
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
