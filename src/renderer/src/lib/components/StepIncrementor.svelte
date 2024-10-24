<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  const handleIncrement = () => {
    dispatch('change', 1n)
  }
  const handleDecrement = () => {
    dispatch('change', -1n)
  }

  export let decrementDisabled = false
  export let incrementDisabled = false

  export let padding = 'p-0'
  export let size = 'size-10'
</script>

<div class="input-group-shim flex h-full items-center justify-center p-0">
  <button
    type="button"
    class="btn flex items-center {padding} {size}"
    class:cursor-not-allowed={decrementDisabled}
    disabled={decrementDisabled}
    on:click={handleDecrement}>-</button
  >
</div>
<div class="input-group-shim flex h-full items-center justify-center p-0">
  <button
    type="button"
    class="btn flex items-center {padding} {size}"
    class:cursor-not-allowed={incrementDisabled}
    disabled={incrementDisabled}
    on:click={handleIncrement}>+</button
  >
</div>

<style lang="postcss">
  .p-0 {
    padding: 0;
  }
  .btn {
    @apply justify-center;
  }
</style>
