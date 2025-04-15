<script lang="ts">
  import { mdiCounter } from '@mdi/js'
  import { AuthClient } from '@/oauth2/auth'
  import { onMount } from 'svelte'
  import Panel from '@/components/Panel.svelte'
  import { FitbitClient } from '../../api/fitbit'
  import { clickOutside } from '@/actions/click-outside'
  import IconButton from '@/components/IconButton.svelte'

  const authClient = new AuthClient('fitbit')

  let client = $state<FitbitClient>()
  let open = $state(false)
  let token = $state<string>()
  let sleepMinutes = $state<number>(-1)

  function onClick() {
    if (token) {
      open = !open
    } else {
      authenticate()
    }
  }

  async function authenticate() {
    const tokenData = await authClient.getAuthToken()
    if (tokenData) {
      token = tokenData
    }
  }

  onMount(async () => {
    const tokenData = await authClient.getTokenFromStoreOrRefreshToken()
    if (tokenData) {
      token = tokenData
      client = new FitbitClient(token)
      sleepMinutes = await client.getSleep()
    }
  })
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
  <IconButton
    tooltip={!open ? 'Fitbit' : ''}
    onclick={onClick}
    icon={mdiCounter}
  />
  <Panel class="absolute right-0 {token && open ? 'block' : 'hidden'}">
    <span class="text-xl"
      >Sleep: {Math.floor(
        sleepMinutes === 0 ? 0 : sleepMinutes / 60
      )}h{sleepMinutes % 60}m</span
    >
  </Panel>
</div>
