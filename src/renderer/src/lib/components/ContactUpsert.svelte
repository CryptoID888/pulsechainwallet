<script lang="ts">
  import * as viem from 'viem'
  import Icon from '@iconify/svelte'
  import { getDrawerStore } from '@skeletonlabs/skeleton'

  import * as api from '$lib/api'

  export let headline = 'Update Contact Note'
  export let name = ''
  export let note: string | null = null
  export let address!: viem.Hex
  export let allowDelete = false
  const drawerStore = getDrawerStore()

  const handleSave = async () => {
    await api.contact.upsert({
      address,
      note,
      name,
    })
    drawerStore.close()
  }
  const handleCancel = () => {
    drawerStore.close()
  }
  const toggleNote = () => {
    if (note === null) {
      note = ''
    } else {
      note = null
    }
  }
</script>

<form on:submit|preventDefault={handleSave} class="flex flex-col items-center p-4">
  <h2 class="h3">{headline}</h2>
  <div class="mb-2 flex w-full flex-row items-center">
    <div class="flex w-full flex-col">
      <label for="name" class="text-xs text-neutral-600">Name</label>
      <input type="text" name="name" id="name" class="input" bind:value={name} />
    </div>
    <button
      type="button"
      class="mt-4 flex size-10 items-center justify-center"
      class:rotate-180={note !== null}
      on:click={toggleNote}>
      <Icon icon="mdi:chevron-down" class="flex" height={24} />
    </button>
  </div>
  <div class="mb-2 flex w-full flex-col overflow-hidden" class:h-0={note === null}>
    <label for="notes" class="text-xs text-neutral-600">Note</label>
    <textarea name="notes" id="notes" class="input" bind:value={note}></textarea>
  </div>
  <span class="py-2 font-bold">{address}</span>
  <div class="flex w-full flex-row justify-center gap-2">
    {#if allowDelete}
      <button type="button" class="variant-ghost-error btn flex flex-grow">Delete</button>
    {/if}
    <button type="button" class="variant-ghost-primary btn flex flex-grow" on:click={handleCancel}>Cancel</button>
    <button type="submit" class="variant-filled-primary btn flex flex-grow">Save</button>
  </div>
</form>
