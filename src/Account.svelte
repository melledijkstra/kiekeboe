<script lang="ts">
  import { onMount } from "svelte";
  import { ACCOUNT_CACHE_KEY } from './constants';
  import { fetchAccountInfo, type Account } from "./google/account";

  let accountInfo = $state<Account>();

  async function getAccountInfo() {
    const { [ACCOUNT_CACHE_KEY]: cachedAccountInfo } = await chrome.storage.local.get([ACCOUNT_CACHE_KEY]);

    if (cachedAccountInfo) {
      accountInfo = cachedAccountInfo
      return
    }

    const fetchedAccountInfo = await fetchAccountInfo()
    if (fetchedAccountInfo) {
      accountInfo = fetchedAccountInfo
      chrome.storage.local.set({ [ACCOUNT_CACHE_KEY]: fetchedAccountInfo })
    }
  }

  onMount(() => {
    getAccountInfo()
  });
</script>

<style lang="postcss">
  .account-info {
    @apply self-end m-5 size-12;
  }
</style>

<div class="account-info">
  {#if accountInfo}
  <img class="rounded-full" src={accountInfo.picture} alt={accountInfo.name} />
  {/if}
</div>

