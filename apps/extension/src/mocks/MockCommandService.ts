import type { CommandServiceInterface } from "@/modules/command-center/CommandServiceInterface"
import type { CommandGroups } from "@/modules/command-center/types"
import { mdiTestTube } from "@mdi/js"
import { fn } from "@storybook/test"

export class MockCommandService implements CommandServiceInterface {
    destroy(): void {
      console.log('Mock command service destroyed')
    }

    get commands(): CommandGroups {
      return {
        Actions: [{
          name: 'Mock Command',
          keywords: ['mock', 'command'],
          icon: mdiTestTube,
          action: (input?: string) => {
            console.log(`Mock command executed with input: ${input}`)
          }
        }],
        Bookmarks: []
      }
    }

    initialize() {
      // Mock initialization logic
    }

    execute(input: string) {
      console.log(`Executing command for input: ${input}`)
      fn()
    }
  }
