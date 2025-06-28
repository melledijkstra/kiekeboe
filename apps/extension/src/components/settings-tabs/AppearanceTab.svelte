<script lang="ts">
  import TextInput from "@/components/TextInput.svelte"
  import Button from "@/components/atoms/Button.svelte"
  import { settings } from "@/settings/index.svelte"
</script>

<h1 class="mb-2 text-xl">Appearance Settings</h1>
<TextInput
  label="Unsplash Query"
  name="unsplash-query"
  placeholder="Unsplash Query"
  bind:value={settings.state.ui.dailyImageQuery}
/>
<Button class="mt-2" onclick={() => settings.saveSettingsToStorage()}>
  Save Settings
</Button>