<script>
  import { onMount } from 'svelte'
  import { isRaspberryAlive } from '@/api/raspberry'

  let raspberryStatus = $state(false)

  onMount(async () => {
    raspberryStatus = await isRaspberryAlive()
  })
</script>

<div class={[
  'transition-colors rounded-full',
  'size-5 shadow-center',
  raspberryStatus ? 'bg-green-500 shadow-green-400' : 'bg-red-500 shadow-red-400'
]}></div>
