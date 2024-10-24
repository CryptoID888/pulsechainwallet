<script lang="ts">
  import type { Erc20Token } from '$lib/tokens'
  import { zeroAddress } from 'viem'
  import NetworkImage from './NetworkImage.svelte'
  export let token!: Erc20Token
</script>

<span class="relative flex size-8">
  <img class="rounded-full" src={token.metadata?.logoURI || ''} alt={token.metadata?.alt || ''} />
  {#if token.address !== zeroAddress}
    <NetworkImage size={12} class="absolute bottom-0 right-0" chain={token.chain} />
  {/if}
</span>
