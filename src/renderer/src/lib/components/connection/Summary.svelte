<script lang="ts">
  import Icon from '@iconify/svelte'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import { writable } from 'svelte/store'
  import { chain } from '$lib/chain-state'
  import { chains } from '$lib/visual-chain'
  import type { Chain as VisualChain } from '$common/token'
  // import { chains as viemChains } from '$lib/chain-state'
  import NetworkImage from '../NetworkImage.svelte'
  import { loading } from '$lib/loading'
  import BlockNumberReadout from '$lib/components/BlockNumber.svelte'
  import PriceSummary from '$lib/components/network/Summary.svelte'
  import * as api from '$lib/api'
  import { onMount } from 'svelte'

  const drawerStore = getDrawerStore()
  const list = Object.values(chains)
  $: currentVisualChain = list.find((c) => +c.id === $chain?.id) as VisualChain
  let cleanup = () => {}
  const openNetworkSelector = async () => {
    cleanup()
    const current = writable<VisualChain | null>(currentVisualChain)
    cleanup = current.subscribe(async (val) => {
      await api.config.set('chainId', val!.id)
    })
    drawerStore.open({
      id: 'network-select',
      position: 'bottom',
      meta: {
        current,
        chains: list,
      },
    })
  }
  onMount(() => () => {
    cleanup()
  })
  $: disabled = !$loading.isResolved(['transaction'])
</script>

<div class="flex">
  <div class="flex w-full items-center justify-between bg-primary-100 px-4 py-1 text-neutral-800 shadow-inner">
    <span class="text-sm">
      <BlockNumberReadout />
    </span>
    <div class="flex flex-row items-center">
      <PriceSummary />
      <button
        type="button"
        class="variant-ghost-primary btn btn-sm py-1 pl-2 pr-0"
        on:click={openNetworkSelector}
        {disabled}>
        <NetworkImage size={16} chain={currentVisualChain} />
        <span>{$chain?.name || ''}</span>
        <span>
          <Icon icon="mdi:chevron-down" class="m-0 flex p-0" height={24} />
        </span>
      </button>
    </div>
  </div>
</div>
