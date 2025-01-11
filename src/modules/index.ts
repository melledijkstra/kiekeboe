export const MODULES = [
  'google_tasks',
  'command_center',
  'well_being',
  'spotify',
  'world_clocks'
] as const

export type Module = (typeof MODULES)[number]

export const MODULE_TITLES: {
  [key in Module]: string
} = {
  google_tasks: 'Google Tasks',
  command_center: 'Command Center',
  well_being: 'Well Being',
  spotify: 'Spotify',
  world_clocks: 'World Clocks'
} as const

export const DEFAULT_MODULE_SETTINGS: { [key in Module]: boolean } = {
  command_center: true,
  well_being: true,
  world_clocks: true,
  google_tasks: false,
  spotify: false
}
