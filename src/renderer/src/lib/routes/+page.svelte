<script lang="ts">
  import { replace, location } from 'svelte-spa-router'

  $: if ($location === '/' || $location === '') {
    console.log('replace /locked at root')
    replace('/locked')
  }
</script>
