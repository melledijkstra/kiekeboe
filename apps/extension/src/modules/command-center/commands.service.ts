import { addToast } from '@/stores/toasts.svelte';
import { mdiBrain, mdiSearchWeb, mdiSticker, mdiBookmark } from '@mdi/js';
import type { CommandServiceInterface } from './CommandServiceInterface';
import type { CommandGroups, CommandItem } from './types';
import type { ILogger } from '@/interfaces/logger.interface';
import { Logger } from '@/logger';
import { commandCenterOpen } from './messages';
import { commandCenterState } from './state.svelte';

const defaultCommands: CommandGroups = {
  Actions: [
    {
      name: 'ChatGPT',
      keywords: ['chatgpt', 'openai', 'gpt'],
      icon: mdiBrain,
      action: (prompt) => {
        if (prompt) {
          const encodedPrompt = encodeURIComponent(prompt)
          const chatgptUrl = `https://chat.openai.com/?prompt=${encodedPrompt}`
          window.open(chatgptUrl, '_blank')
        }
      }
    },
    {
      name: 'Search',
      keywords: ['search', 'find', 'lookup'],
      icon: mdiSearchWeb,
      action: (input?: string) => {
        const query = input?.trim()
        if (query) {
          const encodedQuery = encodeURIComponent(query)
          const searchUrl = `https://www.google.com/search?q=${encodedQuery}`
          window.open(searchUrl, '_blank')
        } else {
          addToast('Please enter a search query.')
        }
      }
    },
    {
      name: 'Toast',
      keywords: ['toast', 'notification'],
      icon: mdiSticker,
      action: (input?: string) => {
        const message = input?.slice(6).trim() || 'Default toast message'
        addToast(message)
      }
    }
  ],
  Bookmarks: [{
    name: 'Open Bookmarks',
    keywords: ['bookmarks', 'favorites'],
    icon: mdiBookmark,
    action: () => {
      const bookmarksUrl = 'chrome://bookmarks/'
      window.open(bookmarksUrl, '_blank')
    }
  }]
}

export class CommandService implements CommandServiceInterface, ILogger {
  logger: Logger = new Logger('CommandService');
  
  private _commands: CommandGroups;

  constructor(commands?: CommandGroups) {
    this.logger.log('Initializing');
    this._commands = {
      ...commands,
      ...defaultCommands
    }
  }

  initialize(): void {
    // respond to command center open messages
    commandCenterOpen.on(() => {
      this.logger.log('Command center opened via runtime message')
      commandCenterState.isOpen = true
    })
  }

  destroy(): void {
    commandCenterState.isOpen = false;
    this.logger.log('Destroying');
  }

  get commands(): CommandGroups {
    return this._commands;
  }

  execute(input: string): void {
    const commandItem = this.findCommand(input)

    if (!commandItem) {
      addToast('Command not recognized. Please try again.')
      return
    }

    const prompt = input?.split(' ').slice(1).join(' ').trim()
    this.logger.log(`Executing command: ${commandItem.name} with prompt: ${prompt}`)
    commandItem.action(prompt)
  }

  findCommand(input: string): CommandItem | undefined {
    const actionCommands = this._commands.Actions;
    for (const command of actionCommands) {
      if (input.startsWith(`/${command.name.toLowerCase()}`)) {
        return command;
      }
    }
  }

  findCommandByName(commandName: string): CommandItem | undefined {
    return this._commands.Actions.find(command => command.name.toLowerCase() === commandName.toLowerCase());
  }
    

  register(command: CommandItem): void {
    this.logger.log(`Registering command: ${command.name}`);
    this._commands.Actions.push(command);
  }

  unregister(command: CommandItem): void {
    this.logger.log(`Unregistering command: ${command.name}`);
    const commandItem = this.findCommandByName(command.name);
    if (commandItem) {
      const index = this._commands.Actions.indexOf(commandItem);
      if (index > -1) {
        this._commands.Actions.splice(index, 1);
      }
    }
  }
}
