<script lang="ts">
  import type { Account, WalletMetadata } from '$common/wallets'
  import Icon from '@iconify/svelte'
  import SeedBox from './account/SeedBox.svelte'
  import Address from './Address.svelte'
  import Copy from './Copy.svelte'
  import Select from './Select.svelte'
  import { getAddress, type Hex } from 'viem'
  import { push as goto } from 'svelte-spa-router'
  import { createEventDispatcher } from 'svelte'
  import Hover from './Hover.svelte'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import { wallets } from '$lib/wallets'
  import * as api from '$lib/api'

  export let walletId!: Hex
  export let currentAddress!: Hex
  export let accounts!: Account[]
  export let itemButtons: string[] = ['showPK', 'copy']

  let wallet: WalletMetadata | null = null
  $: {
    const known = $wallets.find((w) => w.id === walletId)
    if (known) {
      wallet = known
    } else {
      api.wallet.get(walletId).then((w) => {
        wallet = w
      })
    }
  }

  const gotoAddressDetails = (addressIndex: number) => {
    goto(`/account/addresses/${walletId}/detail/${addressIndex}`)
  }
  const dispatch = createEventDispatcher()
  const selectAddress = (derived: Account) => {
    dispatch('select', derived)
  }
  const drawerStore = getDrawerStore()
  const showPrivateKey = (derived: Account) => {
    drawerStore.open({
      id: 'secret-show',
      position: 'bottom',
      meta: {
        walletId,
        addressIndex: derived.address_index,
      },
    })
  }
</script>

<ol class="flex w-full flex-col gap-2">
  {#each accounts as derived}
    <li class="flex w-full items-center justify-stretch rounded bg-white shadow">
      <Hover let:hovering>
        {@const selected = !!currentAddress && getAddress(currentAddress) === getAddress(derived.address)}
        <button
          type="button"
          class="flex w-full flex-row items-center justify-between px-2 py-1"
          on:click={() => selectAddress(derived)}>
          <div class="flex w-full flex-row items-center justify-start gap-2">
            <SeedBox variant="soft" type={wallet?.type} />
            <div class="flex flex-col justify-start text-left leading-4">
              <p>{derived.name}</p>
              <p class="flex flex-row text-sm font-light">
                <Address address={derived.address} />
              </p>
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Select show={hovering || selected} color={hovering && !selected ? 'inactive' : 'success'} />
            {#if itemButtons.includes('showPK')}
              <button
                type="button"
                class="variant-soft-primary size-8 rounded p-2"
                on:click={() => showPrivateKey(derived)}>
                <Icon icon="mdi:eye-lock-open-outline" />
              </button>
            {/if}
            {#if itemButtons.includes('copy')}
              <Copy text={derived.address} let:copy let:copied>
                <button
                  type="button"
                  class="variant-soft-primary size-8 rounded p-2 px-2"
                  on:click|stopPropagation={copy}>
                  {#if copied}
                    <Icon icon="icon-park-outline:file-success-one" height={12} width={12} />
                  {:else}
                    <Icon icon="fa:copy" height={12} width={12} />
                  {/if}
                </button>
              </Copy>
            {/if}
          </div>
        </button>
      </Hover>
      <button
        type="button"
        class="variant-filled-primary m-0 flex items-center justify-center rounded-r border-l p-3 hover:border-l"
        on:click={() => gotoAddressDetails(derived.address_index)}>
        <Icon icon="gravity-ui:circle-chevron-right" height={20} />
      </button>
    </li>
  {/each}
</ol>
