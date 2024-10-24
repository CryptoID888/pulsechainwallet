<script lang="ts">
  import Icon from '@iconify/svelte'

  export let arrow = true
</script>

<button on:click type="button" class="flex w-full flex-row flex-grow">
  <div class="p-3 flex w-full flex-row items-center">
    <div class="flex flex-grow"><slot /></div>
    {#if arrow}
      <Icon icon="fa:chevron-right" />
    {/if}
  </div>
</button>
