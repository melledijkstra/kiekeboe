<script>
  import Button from "@/components/atoms/Button.svelte"
  import TextInput from "@/components/TextInput.svelte"
  import { settings } from "@/settings/index.svelte"
</script>

<h1 class="text-xl">Network Settings</h1>
<TextInput
  class="mb-2"
  label="Database URI"
  bind:value={settings.state.network.databaseUri}
/>
<TextInput
  label="Serverless Host"
  bind:value={settings.state.network.serverlessHost}
/>
<Button class="mt-2" onclick={() => settings.saveSettingsToStorage()}>
  Save Network Settings
</Button>