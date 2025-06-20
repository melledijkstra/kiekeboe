<script>
  import Button from "@/components/atoms/Button.svelte"
  import TextInput from "@/components/TextInput.svelte"
  import { settingsStore, saveSettingsToStorage } from "@/settings"
</script>

<h1 class="text-xl">Network Settings</h1>
<TextInput
  class="mb-2"
  label="Database URI"
  bind:value={$settingsStore.network.databaseUri}
/>
<TextInput
  label="Serverless Host"
  bind:value={$settingsStore.network.serverlessHost}
/>
<Button class="mt-2" onclick={() => saveSettingsToStorage($settingsStore)}>
  Save Network Settings
</Button>