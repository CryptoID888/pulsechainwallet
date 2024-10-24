<script lang="ts">
  import Copy from './Copy.svelte'
  import Icon from '@iconify/svelte'
  export let text = ''
  export let size = 12
  export let name = `copy-${Math.random().toString(36).substring(2, 15)}`
</script>

<Copy {text} let:copy let:copied>
  <button id={name} {name} class="flex flex-grow-0 size-6 items-center justify-center" type="button" on:click={copy}>
    {#if copied}
      <Icon icon="icon-park-outline:file-success-one" height={size} width={size} />
    {:else}
      <Icon icon="fa:copy" height={size} width={size} />
    {/if}
  </button>
</Copy>
