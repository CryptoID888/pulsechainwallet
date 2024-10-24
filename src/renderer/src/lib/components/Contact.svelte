<script lang="ts">
  import { contacts, type Contact } from '$lib/contacts'
  import Icon from '@iconify/svelte'

  export let contact!: Contact

  const updateContact = (contact: Contact, key: keyof Contact, value: string) => {
    contacts.updateOne(contact, {
      [key]: value,
    })
  }
  const removeContact = (contact: Contact) => {
    contacts.remove(contact)
  }
</script>

<div class="flex flex-row">
  <span class="flex flex-row justify-end">
    <button
      class="variant-filled-error btn flex size-8 items-center justify-center text-white"
      type="button"
      on:click|stopPropagation={() => removeContact(contact)}
    >
      <span class="size-6">
        <Icon icon="material-symbols:delete" height={24} />
      </span>
    </button>
  </span>
  <div class="flex flex-col">
    <span class="flex flex-row items-center">
      <span class="flex">
        <span class="min-w-20 text-right">address:&nbsp;</span>
        <span contenteditable="true" on:input={(e) => updateContact(contact, 'address', e.currentTarget?.innerText)}
          >{contact.address}</span
        ></span
      >
    </span>
    <span class="flex flex-row items-center">
      <span class="flex">
        <span class="min-w-20 text-right">name:&nbsp;</span>
        <span contenteditable="true" on:input={(e) => updateContact(contact, 'name', e.currentTarget?.innerText)}>
          {contact.name || ''}
        </span>
      </span>
    </span>
  </div>
</div>
