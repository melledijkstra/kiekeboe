<script lang="ts">
  import { log } from "../../logger"
  
  let open = $state(false)
  let input = $state('')

  function handleCommand(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const command = input.trim()
      if (command.startsWith('/chatgpt')) {
        const prompt = command.slice(8).trim()
        if (prompt) {
          const encodedPrompt = encodeURIComponent(prompt)
          const chatgptUrl = `https://chat.openai.com/?prompt=${encodedPrompt}`
          window.open(chatgptUrl, '_blank')
        }
      }
      // Clear input
      input = ''
      open = false
    }
  }

  function handleKeypress(event: KeyboardEvent) {
    // Check if metaKey (Mac) or ctrlKey (Windows/Linux) is pressed
    if ((event.metaKey || event.ctrlKey) && event.key === "p") {
      event.preventDefault(); // prevents the browser's print dialog
      open = !open
    }

    if (event.key === 'Escape') {
      open = false
    }
  }

  function init(inputElem: HTMLInputElement) {
    inputElem.focus()
  }

  $effect(() => {
    log('registering keypress event')
    document.addEventListener('keydown', handleKeypress);

    return () => {
      document.removeEventListener('keydown', handleKeypress);
    }
  })
</script>

{#if open}
  <div
    id="command-overlay"
    class="flex items-center justify-center font-mono fixed top-0 left-0 w-full h-full bg-black/70 z-50"
    role="dialog">
    <input
      type="text"
      use:init
      bind:value={input}
      onkeydown={handleCommand}
      id="command-input"
      placeholder="Type a command..."
      class="w-3/4 p-2 outline-white text-lg border-none text-white bg-black rounded-md"
    />
  </div>
{/if}
