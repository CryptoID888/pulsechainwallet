<script lang="ts">
  import Icon from '@iconify/svelte'
  export let locked = false
  const toggle = () => {
    locked = !locked
  }
</script>

<button type="button" on:click={toggle} class="mb-8 flex w-10 flex-row items-center justify-center text-neutral-500">
  {#if locked}
    <Icon icon="iconamoon:lock" height={24} />
  {:else}
    <Icon icon="iconamoon:lock-off" height={24} />
  {/if}
</button>
