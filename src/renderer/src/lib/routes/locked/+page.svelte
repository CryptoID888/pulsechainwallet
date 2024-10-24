<script lang="ts">
  import { hasWallets } from '$lib/wallets'
  import Login from '$lib/components/Login.svelte'
  import LoadOrCreate from '$lib/components/LoadOrCreate.svelte'
</script>

{#if $hasWallets}
  <Login message="Welcome back!" />
{:else}
  <LoadOrCreate />
{/if}
