<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Panel from '@/components/atoms/Panel.svelte'
  import PopoverDecorator from '../decorators/PopoverDecorator.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Panel',
    component: Panel,
    parameters: {
      backgrounds: {
        default: 'dark'
      }
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    decorators: [() => PopoverDecorator]
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default">
  <div>Hello World!</div>
</Story>

<Story name="With Components">
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-bold">Hello, world!</h1>
    <p class="text-base">This is a panel component.</p>
    <Toggle parentClass="mt-2" label="Test Label" />
  </div>
</Story>

