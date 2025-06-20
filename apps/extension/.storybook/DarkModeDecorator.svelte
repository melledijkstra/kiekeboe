<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();

  let isDarkMode = $state(false);

  const toggleMode = () => {
    const newMode = !isDarkMode;
    document.documentElement.classList.toggle("dark", newMode);
    isDarkMode = newMode;
  };
</script>

<div>
  {@render children?.()}
</div>

<button
  class="theme_toggle_btn"
  onclick={toggleMode}
  style="
    background-color: { isDarkMode ? '#333' : '#fff' };
    color: { isDarkMode ? '#fff' : '#333' };
  "
>
  { isDarkMode ? 'Light Mode' : 'Dark Mode' }
</button>

<style>
  .theme_toggle_btn {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
  }
</style>