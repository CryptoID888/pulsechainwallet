<script lang="ts">
  import { push, location } from 'svelte-spa-router'
  export let prefix!: string
  const layoutLastLocation = `${prefix}:last-location`
  let lastLocation = localStorage.getItem(layoutLastLocation)
  if (lastLocation) {
    push(lastLocation)
  }
  const blacklisted = new Set([
    '/locked',
    '/locked/login',
    '/locked/create',
    '/locked/restore',
    '/locked/from-mnemonic',
  ])
  $: if (!blacklisted.has($location)) {
    localStorage.setItem(layoutLastLocation, $location)
  }
</script>
