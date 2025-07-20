<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TaskList from '@/components/atoms/tasks/TaskList.svelte'
  import Panel from '@/components/atoms/Panel.svelte'
  import { MockTasksController } from '@/mocks/MockTasksController'
  import type { ComponentProps } from 'svelte'

  type Args = ComponentProps<typeof TaskList>

  const state = $state({
    tasks: [],
    taskLists: []
  })

  const controller = new MockTasksController(state)

  const { Story } = defineMeta({
    title: 'Atoms/TaskList',
    component: TaskList,
    render: template,
    args: {
      tasks: [],
    }
  })
</script>

{#snippet template(args: Args)}
  <Panel size="small">
    <TaskList {...args} />
  </Panel>
{/snippet}

<Story name="Interactive" args={{
  tasks: state.tasks,
  onSaveEdit: (editedTask) => {
    console.log('onSaveEdit', editedTask)
    controller.updateTask(editedTask)
  },
  onRemoveTask: (taskId) => {
    console.log('onRemoveTask', taskId)
    controller.deleteTask(taskId, '@default')
  },
  onToggleTask: (taskId, checked) => {
    console.log('onToggleTask', taskId, checked)
    controller.setTaskStatus(taskId, checked, '@default')
  },
  onCreateTask: (taskTitle) => {
    console.log('onCreateTask', taskTitle)
    controller.createTask(taskTitle, '@default')
  }
}} />

<Story name="No tasks" args={{
  tasks: []
}} />

<Story name="With tasks" args={{
  tasks: [
    {
      id: '1',
      title: 'Task 1',
      status: 'needsAction'
    },
    {
      id: '2',
      title: 'Task 2',
      status: 'needsAction'
    },
    {
      id: '3',
      title: 'Task 3',
      status: 'completed'
    }
  ]
}} />

<Story name="With long tasks" args={{
  tasks: [
    {
      id: '1',
      title: 'Task 1 with a long title that should wrap',
      status: 'needsAction'
    },
    {
      id: '2',
      title: 'Normal Task Title',
      status: 'needsAction'
    },
    {
      id: '3',
      title: 'Task 3 with a long title that should wrap',
      status: 'completed'
    }
  ]
}} />

<Story name="Many tasks" args={{
  tasks: Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: `Task ${i + 1}`,
    status: i % 4 === 0 ? 'needsAction' : 'completed'
  }))
}} />
