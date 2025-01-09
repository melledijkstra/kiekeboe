<script lang="ts">
  import Icon from "@/components/Icon.svelte"
  import { mdiSpotify } from "@mdi/js"
  import { getAuthTokenData, getTokenFromStoreOrRefreshToken } from "./auth"
  import Playback from "./Playback.svelte"
  import { onMount } from "svelte"

  let open = $state(false);
  let token = $state<string>();

  function toggleDisplay() {
    open = !open
  }

  async function authenticate() {
    const tokenData = await getAuthTokenData()
    if (tokenData) {
      token = tokenData
    }
  }

  onMount(async () => {
    const tokenData = await getTokenFromStoreOrRefreshToken()
    if (tokenData) {
      token = tokenData
    }
  })
</script>

<div class="relative">
  <button
    onclick={token ? toggleDisplay : authenticate}
    class="size-12 mx-2 my-5 cursor-pointer">
    <Icon class="text-white" path={mdiSpotify} size={48} />
  </button>
  <div class="absolute right-0 {token && open ? 'block' : 'hidden'}">
    {#if token}
      <Playback token={token} />
    {/if}
  </div>
</div>

