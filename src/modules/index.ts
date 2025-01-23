import { Logger } from '@/logger.ts'
import type { Component } from 'svelte'

const logger = new Logger('modules')

/**
 * MODULE INTERFACE
 */

export interface Module {
  component: Component
  scene?: Component
  init?: () => void
}

type ModuleConfigItem = {
  id: string
  title: string
  import: () => Promise<{ default: Module }>
}

export const MODULE_CONFIG = [
  {
    id: 'google_tasks',
    title: 'Google Tasks',
    import: () => import('./google-tasks/index.ts')
  },
  {
    id: 'world_clocks',
    title: 'World Clocks',
    import: () => import('./world-clocks/index.ts')
  },
  {
    id: 'command_center',
    title: 'Command Center',
    import: () => import('./command-center/index.ts')
  },
  {
    id: 'well_being',
    title: 'Well Being',
    import: () => import('./well-being/index.ts')
  },
  {
    id: 'spotify',
    title: 'Spotify',
    import: () => import('./spotify/index.ts')
  },
  {
    id: 'metrics',
    title: 'Metrics',
    import: () => import('./fitbit/index.ts')
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    import: () => import('./pomodoro/index.ts')
  },
  {
    id: 'countdown',
    title: 'Countdown',
    import: () => import('./countdown/index.ts')
  },
  {
    id: 'weather',
    title: 'Weather',
    import: () => import('./weather/index.ts')
  }
] as const satisfies ReadonlyArray<ModuleConfigItem>

export type ModuleID = (typeof MODULE_CONFIG)[number]['id']

function isValidModule(module: unknown): module is Module {
  return typeof module === 'object' && module !== null && 'component' in module
}

export async function loadModule(id: ModuleID): Promise<Module> {
  const module = MODULE_CONFIG.find((m) => m.id === id)

  if (!module) {
    throw new Error(`Module ${id} not found`)
  }

  const loadedModule = await module.import()
  logger.log(`Loaded module: ${id}`, loadedModule)

  if (!isValidModule(loadedModule.default)) {
    throw new Error(
      `Loaded module "${id}" does not conform to the Module interface`
    )
  }

  return loadedModule.default
}
