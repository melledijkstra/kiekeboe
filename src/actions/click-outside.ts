import type { Action } from 'svelte/action'

export const clickOutside: Action<HTMLElement, () => void> = (
  node,
  callback
) => {
  function handleClick(event: MouseEvent) {
    if (!(node === event.target || node.contains(event.target as Node))) {
      callback()
    }
  }

  window.addEventListener('click', handleClick)

  return {
    update(newCallback) {
      callback = newCallback
    },
    destroy() {
      window.removeEventListener('click', handleClick)
    }
  }
}
