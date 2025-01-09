export const MODULES = [
  'google_tasks',
  'command_center',
  'well_being',
  'spotify'
] as const

export type Module = (typeof MODULES)[number]

export const MODULE_TITLES: {
  [key in Module]: string
} = {
  google_tasks: 'Google Tasks',
  command_center: 'Command Center',
  well_being: 'Well Being',
  spotify: 'Spotify'
} as const

export const DEFAULT_MODULE_SETTINGS: { [key in Module]: boolean } = {
  command_center: true,
  well_being: true,
  google_tasks: false,
  spotify: false
}
