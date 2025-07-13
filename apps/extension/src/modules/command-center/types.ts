export type CommandItem = {
  name: string
  keywords: string[]
  icon: string
  action: (input?: string) => void
}

export enum CommandGroup {
  Actions = 'Actions',
  Bookmarks = 'Bookmarks'
}

export type CommandGroups = Record<keyof typeof CommandGroup, Array<CommandItem>>