<script lang="ts">
  import Icon from "@/components/Icon.svelte"
  import { mdiSpotify } from "@mdi/js"
  import { getAuthToken, getTokenFromStoreOrRefreshToken } from "@/oauth2/auth"
  import Playback from "./Playback.svelte"
  import { onMount } from "svelte"
  import { clickOutside } from "@/actions/click-outside"
  import IconButton from "@/components/IconButton.svelte"

  let open = $state(false)
  let token = $state<string>()

  function toggleDisplay() {
    open = !open
  }

  async function authenticate() {
    const tokenData = await getAuthToken('spotify')
    if (tokenData) {
      token = tokenData
    }
  }

  onMount(async () => {
    const tokenData = await getTokenFromStoreOrRefreshToken('spotify')
    if (tokenData) {
      token = tokenData
    }
  })
</script>

<div class="relative" use:clickOutside={() => open = false}>
  <IconButton onclick={token ? toggleDisplay : authenticate} icon={mdiSpotify} />
  <div class="absolute right-0 {token && open ? 'block' : 'hidden'}">
    {#if token}
      <Playback token={token} />
    {/if}
  </div>
</div>

