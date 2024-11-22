<script lang="ts">
  import type { Contact } from '$common/types'
  import { contactByAddress } from '$lib/contacts'
  import type { Hex } from 'viem'
  import Select from './Select.svelte'
  import { createEventDispatcher } from 'svelte'
  import _ from 'lodash'
  import CopyText from '$lib/components/CopyText.svelte'
  import Address from './Address.svelte'

  const dispatch = createEventDispatcher()

  export let contact: Contact
  export let selected!: Hex
  const selectContact = (contact: Contact) => {
    dispatch('select', contact)
  }
  $: name = $contactByAddress.get(contact.address)?.name
</script>

<div class="flex w-full flex-row justify-between items-stretch">
  <div class="flex flex-row items-center">
    <CopyText text={contact.address} />
    <div class="flex-grow-2 flex-row flex leading-8">
      {#if !_.isNil(name)}
        <div class="flex flex-col">
          <span class="flex leading-5">{name}</span>
          <span class="flex leading-3 text-sm items-center italic">
            <Address address={contact.address} />
          </span>
        </div>
      {:else}
        <span class="leading-8 text-sm flex items-center font-mono">
          <Address address={contact.address} />
        </span>
      {/if}
    </div>
  </div>
  <div class="flex items-stretch">
    {#if contact.address === selected}
      <span class="mr-2">
        <Select show={contact.address === selected} />
      </span>
    {/if}
    <button
      type="button"
      disabled={contact.address === selected}
      class="variant-filled-primary btn btn-sm flex"
      on:click|stopPropagation={() =>
        selectContact({
          address: contact.address,
          name: name ?? '',
          note: null,
        })}>Select</button>
  </div>
</div>
