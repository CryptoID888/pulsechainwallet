<script lang="ts">
  import { contact as contactApi } from '$lib/api'
  import type { Contact } from '$common/contact'
  import Icon from '@iconify/svelte'

  export let contact!: Contact

  const updateContact = async (contact: Contact, name: string, note: string | null) => {
    const updated = await contactApi.updateOne(contact, name, note)
    if (updated) {
      contact = updated
    }
  }
  const removeContact = (contact: Contact) => {
    contactApi.remove(contact)
  }
</script>

<div class="flex flex-row">
  <span class="flex flex-row justify-end">
    <button
      class="variant-filled-error btn flex size-8 items-center justify-center text-white"
      type="button"
      on:click|stopPropagation={() => removeContact(contact)}>
      <span class="size-6">
        <Icon icon="material-symbols:delete" height={24} />
      </span>
    </button>
  </span>
  <div class="flex flex-col">
    <span class="flex flex-row items-center">
      <span class="flex">
        <span class="min-w-20 text-right">address:&nbsp;</span>
        <span contenteditable="true" on:input={(e) => updateContact(contact, e.currentTarget?.innerText, contact.note)}
          >{contact.address}</span
        ></span>
    </span>
    <span class="flex flex-row items-center">
      <span class="flex">
        <span class="min-w-20 text-right">name:&nbsp;</span>
        <span contenteditable="true" on:input={(e) => updateContact(contact, contact.name, e.currentTarget?.innerText)}>
          {contact.name || ''}
        </span>
      </span>
    </span>
  </div>
</div>
