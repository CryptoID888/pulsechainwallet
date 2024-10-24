<script lang="ts">
  import * as viem from 'viem'
  import { contacts, type Contact } from '$lib/contacts'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import { writable } from 'svelte/store'
  export let address!: viem.Hex | null
  export let name!: string

  const drawerStore = getDrawerStore()
  const addToContacts = () => {
    const channel = writable<Contact | null>()
    channel.subscribe((val) => {
      if (val) {
        contacts.push(val)
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
  <button type="button" class="anchor text-sm" on:click={addToContacts}>Add to Contacts</button>
{/if}
