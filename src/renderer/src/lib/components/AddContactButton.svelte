<script lang="ts">
  import * as viem from 'viem'
  import { contacts } from '$lib/contacts'
  import type { Contact } from '$common/types'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import { writable } from 'svelte/store'
  import * as api from '$lib/api'
  export let address!: viem.Hex | null
  export let name!: string
  export let type: 'button' | 'submit' = 'button'

  const drawerStore = getDrawerStore()
  const addToContacts = () => {
    const channel = writable<Contact | null>()
    channel.subscribe(async (val) => {
      if (val) {
        await api.contact.upsert(val)
      }
      drawerStore.close()
    })
    drawerStore.open({
      id: 'contact-upsert',
      position: 'bottom',
      meta: {
        address: address!,
        name: name,
        channel,
      },
    })
  }
</script>

{#if address && viem.isAddress(address) && !$contacts.find((c) => c.address === address)}
  <button {type} class="anchor text-sm" on:click={addToContacts}>Add to Contacts</button>
{/if}
