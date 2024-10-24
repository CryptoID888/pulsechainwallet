<script lang="ts">
  import { chain } from '$lib/chain-state'
  import type { Hex, TransactionReceipt } from 'viem'
  import Loading from '../Loading.svelte'
  import Icon from '@iconify/svelte'
  import Portal from 'svelte-portal'
  import { push as goto } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { pulsechainV4 } from 'viem/chains'

  const emptyHash = '0x'
  let receipt: TransactionReceipt | null = null
  export let hash: Hex = emptyHash
  export let gotoAccount = () => {
    goto('/account')
  }
  const handler = (_, r: TransactionReceipt) => {
    if (r.transactionHash === hash) {
      receipt = r
      cleanup()
    }
  }
  let id: Timer | null = null
  let cleanup = () => {}
  $: if (hash !== emptyHash) {
    cleanup = window.electron.ipcRenderer.on('state:receipt', handler)
    id = setTimeout(() => {
      if (receipt) {
        return
      }
      cleanup()
      console.log('timeout')
    }, 60_000)
  }
  onMount(() => () => {
    cleanup()
    clearTimeout(id)
  })
  $: url = `${$chain.blockExplorers?.default.url}${$chain.id === pulsechainV4.id ? '/#' : ''}/tx/${hash}`
</script>

<div class="flex w-full flex-row items-center justify-center">
  {#if hash === '0x'}
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
      <Icon icon="majesticons:open-line" height={24} />
    </a>
  {/if}
</div>
<Portal target="#sticky-portal">
  <div class="flex flex-row items-center gap-2 bg-primary-50 px-4 py-2 shadow-inner">
    <button class="variant-ghost-primary btn w-full" on:click={gotoAccount}>Continue</button>
  </div>
</Portal>
