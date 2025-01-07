// cache keys
export const NAME_STORAGE_KEY = 'name'
export const DAILY_IMAGE_KEY = 'dailyImage'
export const NEXT_IMAGE_KEY = 'nextDailyImage'
export const ACCOUNT_CACHE_KEY = 'account'

export const UNSPLASH_PROXY_URL =
  'https://e96kk3t1rh.execute-api.eu-north-1.amazonaws.com/proxy'

export const MODULES = ['google_tasks', 'command_center', 'well_being'] as const

export type Module = (typeof MODULES)[number]

export const MODULE_TITLES: {
  [key in Module]: string
} = {
  google_tasks: 'Google Tasks',
  command_center: 'Command Center',
  well_being: 'Well Being'
} as const
