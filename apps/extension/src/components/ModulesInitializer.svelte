<script lang="ts">
  import { loadModule, type Module, type ModuleID } from '@/modules'
  import { settingsStore } from '@/settings/index.svelte'
  import { onMount } from 'svelte'

  const modules = $state<Module[]>([])

  onMount(() => {
    console.log('ModulesInitializer mounted')
    settingsStore.subscribe(async (settings) => {
      const modulePromises = Object.entries(settings.modules)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => loadModule(name as ModuleID))

      const loadedModules = await Promise.all(modulePromises)

      for (const module of loadedModules) {
        if (module) {
          modules.push(module)
        }
      }
    })
  })
</script>
