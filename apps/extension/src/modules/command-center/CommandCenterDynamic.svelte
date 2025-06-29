<script lang="ts">
  import CommandCenter from "./CommandCenter.svelte"
  import { CommandService } from "./commands.service"

  const commandService = new CommandService()
</script>

<CommandCenter commandService={commandService} />