<script lang="ts">
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Tasks from './Tasks.svelte'
  import Account from './Account.svelte'
  import Welcome from './Welcome.svelte'
</script>

<Curtain />

<div class="grid h-full grid-rows-3 grid-rows animate-fade-in">
  <!-- TOP --->
  <div class="justify-self-end">
    <Account />
  </div>
  <!-- MIDDLE --->
  <div class="justify-self-center self-center text-center">
    <Clock />
    <Welcome />
  </div>
  <!-- BOTTOM -->
  <div class="justify-self-end self-end"> 
    <Tasks />
  </div>
</div>

