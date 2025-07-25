<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import NotesPanelContent from '@/modules/notes/NotesPanelContent.svelte'
  import type { Note } from '@/db/notes'
  import Panel from '@/components/atoms/Panel.svelte'
  import type { ComponentProps } from 'svelte'

  type NotesPanelContentProps = ComponentProps<typeof NotesPanelContent>

  const notes: Array<Note> = [
    {
      title: 'Note 1',
      text: 'This is the first note',
      dateCreated: new Date()
    },
    {
      title: 'Note 2',
      text: 'This is the second note',
      dateCreated: new Date()
    },
    {
      title: 'Note 3',
      text: 'This is the third note',
      dateCreated: new Date()
    }
  ]

  const { Story } = defineMeta({
    title: 'Atoms/Notes',
    render: template,
    component: NotesPanelContent,
    args: {
      notes,
    }
  })
</script>

{#snippet template(args: NotesPanelContentProps)}
  <Panel>
    <NotesPanelContent {...args} />
  </Panel>
{/snippet}

<Story name="Default" />

<Story name="No notes" args={{
  notes: []
}} />
