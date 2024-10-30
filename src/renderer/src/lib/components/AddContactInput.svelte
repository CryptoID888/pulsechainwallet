<script lang="ts">
  import * as viem from 'viem'
  import AddressInput from './AddressInput.svelte'
  import { getDrawerStore } from '@skeletonlabs/skeleton'

  let value = ''
  let address: viem.Hex | null = null
  const drawerStore = getDrawerStore()
  const addContact = () => {
    drawerStore.open({
      id: 'contact-upsert',
      position: 'bottom',
      meta: {
        address,
        name: value === address ? '' : value,
      },
    })
  }
  $: disabled = !address || !viem.isAddress(address)
</script>

<form class="flex w-full flex-row gap-2" on:submit|preventDefault={addContact}>
  <AddressInput bind:value bind:address />
  <button type="submit" class="hidden" {disabled}></button>
</form>
