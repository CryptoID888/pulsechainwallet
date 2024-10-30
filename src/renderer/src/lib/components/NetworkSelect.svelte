<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import Select from './Select.svelte'
  import NetworkImage from './NetworkImage.svelte'
  import type { Chain } from '$common/token'
  import { chainIdToChain } from '$lib/chain-state'
  import { config } from '$lib/config'

  export let current: Writable<Chain | null> = writable(null)
  export let chains: Chain[] = []
  const matches = (chain: Chain) => chain.id === $current?.id
</script>

<div class="p-4 text-center">
  <h3 class="h3 mb-4">Select Network</h3>
  <ol class="list">
    {#each chains as chain}
      {#if $config.showTestnets || chain.id !== 943}
        <li class="flex w-full items-center">
          <button
            type="button"
            class="flex w-full flex-row items-center justify-items-center"
            on:click={() => {
              current.set(chain)
              // reflow the each loop
              chains = chains
            }}>
            <span class="flex flex-grow-[3]"></span>
            <span class="flex flex-grow-[1] gap-2">
              <Select show={matches(chain)} />
              <span class="flex min-w-40 items-center justify-start gap-2">
                <NetworkImage {chain} size={32} />
                <span>{chainIdToChain.get(+chain.id)?.name}</span>
              </span>
            </span>
            <span class="flex flex-grow-[2]"></span>
          </button>
        </li>
      {/if}
    {/each}
  </ol>
</div>
