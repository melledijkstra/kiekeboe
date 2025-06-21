import { mount } from 'svelte';
import CommandCenter from '@/modules/command-center/CommandCenter.svelte';

const COMPONENT_ID = 'command-center';

if (!document.getElementById(COMPONENT_ID)) {
  const target = document.createElement("div");
  target.id = COMPONENT_ID;
  document.body.appendChild(target);
  
  mount(CommandCenter, {
    target,
    props: {
      forceOpen: true
    }
  })
} else {
  // we already have the command center mounted
  // open the command center
  document.dispatchEvent(new CustomEvent('command-center:open'))
}

