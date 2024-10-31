<script lang="ts">
  import { contactByAddress } from '$lib/contacts'
  import type { Hex } from 'viem'
  import AddressInput from './AddressInput.svelte'
  import { writable } from 'svelte/store'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import Icon from '@iconify/svelte'
  import { createEventDispatcher } from 'svelte'
  import { emptyHex } from '$common/config'

  const drawerStore = getDrawerStore()
  const dispatch = createEventDispatcher()

  const openContactList = () => {
    const selected = writable({
      input: toValue,
      address: toAddress,
    })
    selected.subscribe((val) => {
      if (val.address !== emptyHex) {
        toValue = val.address
        toAddress = val.address
        dispatch('change', val)
      }
    })
    drawerStore.open({
      id: 'contact-select',
      position: 'bottom',
      meta: {
        selected,
      },
    })
  }

  export let toValue = ''
  export let toAddress: Hex = emptyHex
</script>

<div class="flex flex-row items-center gap-2">
  <AddressInput on:change bind:value={toValue} bind:address={toAddress}>
    <svelte:fragment slot="label"
      >To{#if !!$contactByAddress.get(toAddress)}: {$contactByAddress.get(toAddress)?.name || ''}
      {/if}</svelte:fragment
    >
  </AddressInput>

  <button type="button" class="variant-soft-primary rounded px-3.5 py-3" on:click={openContactList}>
    <Icon icon="cil:contact" height={20} width={20} />
  </button>
</div>
