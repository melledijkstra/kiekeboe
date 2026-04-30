<script lang="ts">
  import { loadModule, type Module, type ModuleID } from '@/modules'
  import { settingsStore } from '@/settings/index.svelte'
  import { onMount } from 'svelte'

  const modules = $state<Module[]>([])

  onMount(() => {
    console.log('ModulesInitializer mounted')
    const unsub = settingsStore.subscribe(async (settings) => {
      const modulePromises = Object.entries(settings.modules)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => loadModule(name as ModuleID))

      const loadedModules = await Promise.all(modulePromises)

      // Update modules array atomically to trigger Svelte reactivity correctly if needed
      // though $state handles array mutations, but it's cleaner to reset it if it's meant to represent current settings
      modules.length = 0
      for (const module of loadedModules) {
        if (module) {
          modules.push(module)
        }
      }
    })

    return unsub
  })
</script>
