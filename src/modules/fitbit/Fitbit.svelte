<script lang="ts">
  import Icon from "@/components/Icon.svelte"
  import { mdiBottleTonicPlus } from "@mdi/js"
  import { getAuthToken, getTokenFromStoreOrRefreshToken } from "@/oauth2/auth"
  import { onMount } from "svelte"
  import Card from "@/components/Card.svelte"
  import { getSleep } from "./api"

  let open = $state(false);
  let token = $state<string>();
  let sleep = $state<number>(-1);

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
      sleep = await getSleep(token)
    }
  })
</script>

<div class="relative">
  <button
    onclick={token ? toggleDisplay : authenticate}
    class="cursor-pointer">
    <Icon class="text-white" path={mdiBottleTonicPlus} size={48} />
  </button>
  <Card class="absolute right-0 {token && open ? 'block' : 'hidden'}">
    <span class="text-xl">{sleep}</span>
  </Card>
</div>

