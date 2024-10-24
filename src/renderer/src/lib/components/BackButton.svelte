<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  export let cancelText = 'Back'
  const dispatch = createEventDispatcher()
</script>

<button
  type="button"
  class="variant-soft-error btn"
  on:click={() => {
    dispatch('cancel')
  }}>{cancelText}</button
>
