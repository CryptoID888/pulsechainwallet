<script lang="ts">
  import PercentChange from '$lib/components/PercentChange.svelte'
  import Number from '$lib/components/Number.svelte'
  import PriceFetch from '$lib/components/PriceFetch.svelte'
  import Loader from '$lib/components/Loader.svelte'

  import * as viem from 'viem'
  import Icon from '@iconify/svelte'

  import { whitelistedERC20 } from '$lib/tokens'
  import { chain } from '$lib/chain-state'
  import * as visualChains from '$lib/visual-chain'
  import { loading } from '$lib/loading'

  let current = 0n
  let previous = 0n
  $: token = whitelistedERC20.find((token) => token.address === viem.zeroAddress && +token.chain.id === $chain.id)!
  const day = 1000 * 60 * 60 * 24
  $: blockOffset = BigInt(Math.floor(day / visualChains.chainById.get($chain.id)!.blockTime!))
</script>

<div class="flex flex-row items-center opacity-70 hover:opacity-100">
  <div class="flex items-center px-2 py-1 text-sm leading-6">
    <Icon icon="fa:dollar" height={12} />
    {#if current}
      <Number x={current} truncateZeros />
      <span class="ml-2">
        <PercentChange {previous} {current} />
      </span>
    {/if}
    {#if !current && !$loading.isResolved('price')}
      <Loader size={16} />
    {/if}
  </div>
  <PriceFetch bind:token bind:price={current} />
  <PriceFetch bind:token bind:price={previous} {blockOffset} />
</div>
