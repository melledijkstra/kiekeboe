<script>
  import Toggle from "@/components/atoms/Toggle.svelte"
  import { settings } from "@/settings/index.svelte"
</script>

<h1 class="text-xl">General Settings</h1>
<Toggle
  disabled={!settings.state.loaded}
  label="Show currently focussed task (required Google Tasks)"
  parentClass="my-2"
  onchange={() => settings.saveSettingsToStorage()}
  bind:checked={settings.state.ui.showCurrentTask}
/>