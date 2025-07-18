<script lang="ts">
  import { elasticOut } from 'svelte/easing';
  import { onMount } from 'svelte'

  let visible = $state(false);
  let hello = $state('Hi there')

  onMount(() => {
    console.log('DebugApp mounted')
  })

  function whoosh(node: HTMLElement, params: { delay?: number, duration?: number, easing?: (t: number) => number }) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t: number) => {
        console.log(`scale(${t})`, existingTransform)
        return `transform: ${existingTransform} scale(${t})`
      }
		};
	}
</script>

<main class="text-white p-5">
  <h1 class="text-2xl font-bold">{hello}</h1>
  <p>This is a debug page for testing</p>
  
  <button onclick={() => visible = !visible}>toggle visible</button>

  {#if visible}
    <div transition:whoosh={{ duration: 2000 }}>fades in and out over two seconds</div>
  {/if}
</main>
