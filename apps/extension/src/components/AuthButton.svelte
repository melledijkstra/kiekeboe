<script lang="ts">
  import type { OauthProvider } from '@/oauth2/providers'
  import Button from './atoms/Button.svelte'
  import Icon from './atoms/Icon.svelte'
  import { mdiSpotify } from '@mdi/js'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  const classes: Record<OauthProvider, string | string[]> = {
    google: [
      'bg-google hover:bg-google/80 focus:ring-4 focus:outline-hidden focus:ring-google/50 dark:focus:ring-google/55',
      'disabled:bg-gray-400 disabled:focus:ring-gray-300 disabled:cursor-auto'
    ],
    spotify: [
      'bg-spotify hover:bg-spotify/80 focus:ring-4 focus:outline-hidden focus:ring-spotify/50 dark:focus:ring-spotify/55',
      'disabled:bg-gray-400 disabled:focus:ring-gray-300 disabled:cursor-auto'
    ],
    fitbit: [
      'bg-fitbit hover:bg-fitbit/80 focus:ring-4 focus:outline-hidden focus:ring-fitbit/50 dark:focus:ring-fitbit/55',
      'disabled:bg-gray-400 disabled:focus:ring-gray-300 disabled:cursor-auto'
    ]
  }

  const {
    provider,
    children,
    ...props
  }: {
    provider: OauthProvider
  } & HTMLButtonAttributes = $props()
</script>

{#snippet google()}
  <svg
    class="w-4 h-4 me-2"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 19"
  >
    <path
      fill-rule="evenodd"
      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
      clip-rule="evenodd"
    />
  </svg>
{/snippet}

{#snippet fitbit()}
  <svg
    class="w-4 h-4 me-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M13.298 1.825c0 .976-.81 1.785-1.786 1.785-.972 0-1.784-.81-1.784-1.785 0-.973.813-1.785 1.784-1.785.976 0 1.786.813 1.786 1.785zm-1.786 3.243c-1.052 0-1.863.81-1.863 1.866 0 1.053.81 1.865 1.865 1.865 1.053 0 1.865-.811 1.865-1.865s-.825-1.866-1.875-1.866h.008zm0 5.029c-1.052 0-1.945.891-1.945 1.945s.894 1.945 1.947 1.945 1.946-.891 1.946-1.945-.894-1.945-1.946-1.945h-.002zm0 5.107c-1.052 0-1.863.81-1.863 1.864s.81 1.866 1.865 1.866c1.053 0 1.865-.811 1.865-1.866 0-.972-.825-1.864-1.875-1.864h.008zm0 5.191c-.972 0-1.784.809-1.784 1.784 0 .97.813 1.781 1.784 1.781.977 0 1.786-.809 1.786-1.784 0-.973-.81-1.781-1.786-1.781zM16.46 4.823c-1.136 0-2.108.977-2.108 2.111 0 1.134.973 2.107 2.108 2.107 1.135 0 2.106-.975 2.106-2.107 0-1.135-.972-2.109-2.106-2.109v-.002zm0 5.03c-1.216 0-2.19.973-2.19 2.19 0 1.216.975 2.187 2.19 2.187 1.215 0 2.189-.971 2.189-2.189 0-1.216-.974-2.188-2.189-2.188zm0 5.108c-1.136 0-2.108.976-2.108 2.107 0 1.135.973 2.109 2.108 2.109 1.135 0 2.106-.976 2.106-2.109s-.971-2.107-2.106-2.107zm5.106-5.353c-1.296 0-2.43 1.055-2.43 2.434 0 1.297 1.051 2.433 2.43 2.433 1.381 0 2.434-1.065 2.434-2.444-.082-1.382-1.135-2.431-2.434-2.431v.008zM6.486 5.312c-.892 0-1.62.73-1.62 1.623 0 .891.729 1.62 1.62 1.62.893 0 1.619-.729 1.619-1.62 0-.893-.727-1.62-1.619-1.62v-.003zm0 5.027c-.973 0-1.703.729-1.703 1.703 0 .975.721 1.703 1.695 1.703s1.695-.73 1.695-1.703c0-.975-.735-1.703-1.71-1.703h.023zm0 5.107c-.892 0-1.62.731-1.62 1.62 0 .895.729 1.623 1.62 1.623.893 0 1.619-.735 1.619-1.635s-.727-1.62-1.619-1.62v.012zm-5.025-4.863c-.813 0-1.461.646-1.461 1.459 0 .81.648 1.459 1.46 1.459.81 0 1.459-.648 1.459-1.459s-.648-1.459-1.458-1.459z"
    />
  </svg>
{/snippet}

<Button {...props} class={[classes[provider], props.class]}>
  {#if provider === 'google'}
    {@render google()}
  {:else if provider === 'spotify'}
    <Icon class="w-4 h-4 me-2" path={mdiSpotify} />
  {:else if provider === 'fitbit'}
    {@render fitbit()}
  {/if}
  {#if children}
    {@render children()}
  {:else}
    Sign in with&nbsp;<span class="capitalize">{provider}</span>
  {/if}
</Button>
