<script lang="ts">
  import Back from './Back.svelte'
  import { push } from 'svelte-spa-router'
  export let backup: string | null = null
  export let disabled = false
</script>

<Back let:back>
  <button
    type="button"
    class="variant-soft-error btn"
    {disabled}
    on:click={() => {
      if (backup) push(backup)
      else back()
    }}><slot /></button>
</Back>
