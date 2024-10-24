<script lang="ts">
  import { onMount } from 'svelte'
  import { replace, location } from 'svelte-spa-router'

  onMount(() => {
    if ($location === '/' || $location === '') {
      console.log('replace /locked at root')
      replace('/locked')
    }
  })
</script>
