<script lang="ts">
  import { loadModule, type Module, type ModuleID } from '@/modules'
  import { settingsStore } from '@/settings/index.svelte'
  import { onMount } from 'svelte'

  const modules = $state<Module[]>([])

  onMount(() => {
    console.log('ModulesInitializer mounted')
    settingsStore.subscribe(async (settings) => {
      for (const [moduleName, moduleEnabled] of Object.entries(settings.modules)) {
        if (moduleEnabled) {
          const module = await loadModule(moduleName as ModuleID)
          if (module) {
            modules.push(module)
          }
        }
      }
    })  
  })
</script>
