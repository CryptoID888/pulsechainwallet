<script lang="ts">
  import { push, location } from 'svelte-spa-router'
  export let prefix!: string
  const layoutLastLocation = `${prefix}:last-location`
  let lastLocation = localStorage.getItem(layoutLastLocation)
  if (lastLocation) {
    push(lastLocation)
  }
  $: localStorage.setItem(layoutLastLocation, $location)
</script>
