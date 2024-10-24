<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import { contacts, type Contact } from '$lib/contacts'
  import Icon from '@iconify/svelte'
  import AddContactInput from './AddContactInput.svelte'
  import Select from './Select.svelte'

  export let selected: Writable<Contact> = writable({
    name: '',
    address: '0x',
    note: null,
  })
  const selectContact = (contact: Contact) => {
    selected.set(contact)
  }
</script>

<div class="flex flex-col items-center p-4">
  <Icon icon="material-symbols-light:connect-without-contact" height="64" />
  {#if !$contacts.length}
    <span class="my-4">no established contacts</span>
    <AddContactInput />
  {:else}
    <AddContactInput />
    <ol class="list flex w-full flex-col">
      {#each $contacts as contact}
        <li class="flex w-full">
          <div class="flex w-full flex-row items-center justify-between">
            <span class="flex-grow-2">
              {contact.name || contact.address}
            </span>

            <div class="flex">
              {#if contact.address === $selected.address}
                <span class="mr-2">
                  <Select show={contact.address === $selected.address} />
                </span>
              {/if}
              <button
                type="button"
                disabled={contact.address === $selected.address}
                class="variant-filled-primary btn btn-sm"
                on:click|stopPropagation={() => selectContact(contact)}>Select</button
              >
            </div>
          </div>
        </li>
      {/each}
    </ol>
  {/if}
</div>
