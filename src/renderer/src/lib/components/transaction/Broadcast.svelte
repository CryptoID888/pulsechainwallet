<script lang="ts">
  import { chain } from '$lib/chain-state'
  import type { Hex, TransactionReceipt } from 'viem'
  import Loading from '../Loading.svelte'
  import Icon from '@iconify/svelte'
  import Portal from 'svelte-portal'
  import { push as goto } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { pulsechainV4 } from '$common/chains'
  import { state } from '$lib/api'
  import { emptyHex, type ChainIds } from '$common/config'

  let receipt: TransactionReceipt | null = null
  export let hash: Hex = emptyHex
  export let gotoAccount = () => {
    goto('/account')
  }
  /** go to the transaction details page for the transaction that has just been mined */
  export let gotoDetails = () => {
    goto(`/account/transactions/${$chain.id}/${hash}`)
  }
  const handler = (r: TransactionReceipt) => {
    if (r.transactionHash === hash) {
      receipt = r
      cleanup()
    }
  }
  let id: Timer | null = null
  let cleanup = () => {
    clearTimeout(id)
    id = null
  }
  $: if (hash !== emptyHex && !receipt) {
    state
      .transactionWait($chain.id as ChainIds, hash)
      .catch(() => state.transactionWait($chain.id as ChainIds, hash))
      .then(handler)
    id = setTimeout(() => {
      cleanup()
      console.log('timeout')
    }, 60_000)
  }
  onMount(() => () => cleanup())
  $: url = `${$chain.blockExplorers?.default.url}${$chain.id === pulsechainV4.id ? '/#' : ''}/tx/${hash}`
</script>

<div class="flex w-full flex-row items-center justify-center">
  {#if hash === emptyHex}
    <span class="flex flex-col items-center justify-center">
      Waiting for network response <Loading />
    </span>
  {:else if !receipt}
    <div class="flex flex-col justify-center">
      <span class="flex flex-col items-center justify-center">
        Waiting for transaction to be mined <Loading />
      </span>
      <a href={url} target="_blank" rel="noopener noreferrer" class="flex flex-row items-center justify-center">
        Preview <Icon icon="majesticons:open-line" height={24} />
      </a>
    </div>
  {:else}
    <a href={url} target="_blank" rel="noopener noreferrer" class="flex flex-row items-center justify-center">
      <span>Transaction mined</span>
      <!-- <Icon icon="majesticons:open-line" height={24} /> -->
    </a>
  {/if}
</div>
<Portal target="#sticky-portal">
  <div class="flex flex-row items-center gap-2 bg-primary-50 px-4 py-2 shadow-inner">
    <button type="button" class="variant-ghost-primary btn w-full" on:click={gotoAccount}>Continue</button>
    <button type="button" class="variant-filled-primary btn w-full" on:click={gotoDetails}>Details</button>
  </div>
</Portal>
