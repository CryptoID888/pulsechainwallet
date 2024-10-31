<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Loader from './Loader.svelte'
  type Input = bigint | number | string
  export let chips: Set<Input> = new Set()
  export let selected: Set<Input> = new Set()
  export let disabled: Set<Input> = new Set()
  export let loading: Set<Input> = new Set()
  const dispatch = createEventDispatcher()

  const toggleSelected = (leafIndex: Input) => {
    dispatch('toggle', leafIndex)
  }
</script>

<ul class="flex max-h-32 w-full flex-row flex-wrap gap-1 overflow-y-auto">
  {#each chips.values() as leafIndex}
    {@const isDisabled = disabled.has(leafIndex)}
    {@const isSelected = selected.has(leafIndex)}
    {@const isLoading = loading.has(leafIndex)}
    <li>
      <button
        type="button"
        class="chip flex flex-row items-center"
        class:variant-soft-primary={!isSelected}
        class:variant-filled-primary={isSelected}
        disabled={isDisabled}
        on:click={() => toggleSelected(leafIndex)}
      >
        {#if isLoading}
          <Loader size={16} />
        {/if}
        <span>{leafIndex}</span>
      </button>
    </li>
  {/each}
</ul>

<style lang="postcss">
  .chip {
    @apply px-2 py-1;
  }
</style>
