<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import Icon from '@iconify/svelte'

  import { contactByAddress, contacts } from '$lib/contacts'
  import type { Contact } from '$common/types'
  import { addedAccounts } from '$lib/wallets'
  import AddContactInput from '$lib/components/AddContactInput.svelte'
  import AddressSelectItem from '$lib/components/AddressSelectItem.svelte'
  import { emptyHex } from '$common/config'

  export let selected: Writable<Contact> = writable({
    name: '',
    address: emptyHex,
    note: null,
  })
  const selectContact = (e: CustomEvent<Contact>) => {
    selected.set(e.detail)
  }
</script>

<div class="flex flex-col items-center p-4 justify-start">
  <Icon icon="material-symbols-light:connect-without-contact" height={64} />
  <AddContactInput />
  <h3 class="h3 flex w-full">Contacts</h3>
  {#if $contacts.length > 0}
    <ol class="list flex w-full flex-col">
      {#each $contacts as contact}
        <li class="flex w-full">
          <AddressSelectItem on:select={selectContact} selected={$selected.address} {contact} />
        </li>
      {/each}
    </ol>
  {:else}
    <p>no contacts added yet</p>
  {/if}
  <h3 class="h3 flex w-full">Accounts</h3>
  <ol class="list flex w-full flex-col">
    {#each $addedAccounts as account}
      {@const contact = $contactByAddress.get(account.address) || {
        name: account.address,
        address: account.address,
        note: null,
      }}
      <li class="flex w-full">
        <AddressSelectItem on:select={selectContact} selected={$selected.address} {contact} />
      </li>
    {/each}
  </ol>
</div>
