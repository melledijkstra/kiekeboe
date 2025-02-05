<script lang="ts">
  let { value = $bindable(), ...props } = $props()
</script>

<input
  {...props}
  type="text"
  class={['text-black p-2 rounded-sm', props.class]}
  bind:value
/>
