<script lang="ts">
  import Icon from "@/components/Icon.svelte"
  import { mdiCounter } from "@mdi/js"
  import { getAuthToken, getTokenFromStoreOrRefreshToken } from "@/oauth2/auth"
  import { onMount } from "svelte"
  import Card from "@/components/Card.svelte"
  import { getSleep } from "./api"

  let open = $state(false);
  let token = $state<string>();
  let sleepMinutes = $state<number>(-1);

  function toggleDisplay() {
    open = !open
  }

  async function authenticate() {
    const tokenData = await getAuthToken('fitbit')
    if (tokenData) {
      token = tokenData
    }
  }

  onMount(async () => {
    const tokenData = await getTokenFromStoreOrRefreshToken('fitbit')
    if (tokenData) {
      token = tokenData
      sleepMinutes = await getSleep(token)
    }
  })
</script>

<div class="relative">
  <button
    onclick={token ? toggleDisplay : authenticate}
    class="cursor-pointer">
    <Icon class="text-white" path={mdiCounter} size={48} />
  </button>
  <Card class="absolute right-0 {token && open ? 'block' : 'hidden'}">
    <span class="text-xl">Sleep: {Math.floor(sleepMinutes === 0 ? 0 : sleepMinutes / 60)}h{sleepMinutes % 60}m</span>
  </Card>
</div>

