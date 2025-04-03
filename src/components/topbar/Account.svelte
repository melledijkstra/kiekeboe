<script lang="ts">
  import { onMount } from 'svelte'
  import { ACCOUNT_CACHE_KEY } from '../../constants'
  import browser from 'webextension-polyfill'
  import { fetchAccountInfo, type Account } from '@/api/google/account'

  const DEFAULT_IMAGE = "data:image/jpeg;base64,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"

  let accountInfo = $state<Account>()

  async function getAccountInfo() {
    const { [ACCOUNT_CACHE_KEY]: cachedAccountInfo } =
      await browser.storage.local.get([ACCOUNT_CACHE_KEY])

    if (cachedAccountInfo) {
      accountInfo = cachedAccountInfo as Account
      return
    }

    const fetchedAccountInfo = await fetchAccountInfo()
    if (fetchedAccountInfo) {
      accountInfo = fetchedAccountInfo
      browser.storage.local.set({ [ACCOUNT_CACHE_KEY]: fetchedAccountInfo })
    }
  }

  onMount(() => {
    getAccountInfo()
  })
</script>

{#if !!accountInfo}
  <a href="https://myaccount.google.com/" target="_blank">
    <img
      class="size-10 rounded-full border-2 border-white/80"
      src={accountInfo.picture ?? DEFAULT_IMAGE}
      alt={accountInfo.name}
    />
  </a>
{/if}
