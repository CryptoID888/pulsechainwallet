<script lang="ts">
  import { push as goto } from 'svelte-spa-router'
</script>

<div class="flex justify-center items-center h-full">
  <button
    class="btn bg-primary-active-token mx-2"
    on:click={() => {
      goto('/locked/load')
    }}>Import</button
  >
  <button
    class="btn bg-primary-active-token mx-2"
    on:click={() => {
      goto('/locked/create')
    }}>Create New</button
  >
</div>
