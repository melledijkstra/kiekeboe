<script lang="ts">
  import { onMount } from "svelte";
  import { ACCOUNT_CACHE_KEY } from './constants';
  import browser from 'webextension-polyfill';
  import { fetchAccountInfo, type Account } from "@/api/google/account";

  let accountInfo = $state<Account>();

  async function getAccountInfo() {
    const { [ACCOUNT_CACHE_KEY]: cachedAccountInfo } = await browser.storage.local.get([ACCOUNT_CACHE_KEY]);

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
  });
</script>

<div class="size-12">
  {#if accountInfo}
  <a
    href="https://myaccount.google.com/" target="_blank">
    <img
      class="rounded-full border-2 border-white/80"
      src={accountInfo.picture}
      alt={accountInfo.name} />
  </a>
  {/if}
</div>

