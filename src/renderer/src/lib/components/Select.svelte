<script lang="ts">
  import Icon from '@iconify/svelte'

  export let show = false
  export let size = 'size-8'
  export let color = 'success'
</script>

<span
  class="flex items-center rounded-full p-1 text-center {size}"
  class:border-2={show}
  class:variant-filled-success={show && color === 'success'}
  class:text-white={show && (color === 'success' || color === 'primary')}
  class:variant-filled-primary={show && color === 'primary'}
  class:border-neutral-400={show && color === 'inactive'}
  class:text-neutral-400={show && color === 'inactive'}
>
  {#if show}
    <Icon class="flex" icon="material-symbols:check" height="20" />
  {/if}
</span>
