<script lang="ts">
  import TextInput from "@/components/TextInput.svelte"
  import Button from "@/components/atoms/Button.svelte"
  import { settingsStore, saveSettingsToStorage } from "@/settings"
</script>

<h1 class="mb-2 text-xl">Appearance Settings</h1>
<TextInput
  label="Unsplash Query"
  name="unsplash-query"
  placeholder="Unsplash Query"
  bind:value={$settingsStore.ui.dailyImageQuery}
/>
<Button class="mt-2" onclick={() => saveSettingsToStorage($settingsStore)}>
  Save Settings
</Button>