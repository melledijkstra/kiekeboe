<script>
  import Button from "@/components/atoms/Button.svelte"
  import Input from "@/components/atoms/Input.svelte"
  import { settings } from "@/settings/index.svelte"
</script>

<h1 class="text-xl">Network Settings</h1>
<Input
  class="mb-2"
  label="Database URI"
  type="text"
  bind:value={settings.state.network.databaseUri}
/>
<Input
  label="Serverless Host"
  type="text"
  bind:value={settings.state.network.serverlessHost}
/>
<Button class="mt-2" onclick={() => settings.saveSettingsToStorage()}>
  Save Network Settings
</Button>