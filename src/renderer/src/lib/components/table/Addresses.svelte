<script lang="ts">
  import ThFilter from '$lib/components/table/ThFilter.svelte'
  import Search from '$lib/components/table/Search.svelte'
  import RowsPerPage from '$lib/components/table/RowsPerPage.svelte'
  import RowCount from '$lib/components/table/RowCount.svelte'
  import Pagination from '$lib/components/table/Pagination.svelte'
  import Copy from '$lib/components/Copy.svelte'
  import Back from '$lib/components/Back.svelte'

  import { DataHandler } from '@vincjo/datatables'
  import { SlideToggle } from '@skeletonlabs/skeleton'
  import type { Hex } from 'viem'
  import { pop } from 'svelte-spa-router'
  import Portal from 'svelte-portal'
  import { onMount } from 'svelte'

  import { contactByAddress } from '$lib/contacts'
  import { stickyFilledOnMount } from '$lib/ui'
  import { wallet } from '$lib/api'
  import type { Account } from '$common/wallets'

  onMount(stickyFilledOnMount)

  const toggleIndexAddition = (e: Event, index: number) => {
    const checked = (e.target as HTMLInputElement)?.checked
    changes.added[index] = checked
    changes = changes
  }
  const onSave = async () => {
    const adds = new Set([...added.values()])
    for (const [id, val] of Object.entries(changes.added)) {
      if (val) adds.add(+id)
      else adds.delete(+id)
    }
    await wallet.updateAddedAccounts(walletId, [...adds.values()])
    pop()
  }
  const updateLocalContactName = (e: Event, address: Hex) => {
    const target = e.target as HTMLSpanElement
    const value = target.innerText
    localContactNames[address] = value
    localContactNames = localContactNames
  }
  const deleteLocalContactName = (address: Hex) => {
    delete localContactNames[address]
    localContactNames = localContactNames
  }
  const addressName = (address: Hex) => {
    return localContactNames[address] || $contactByAddress.get(address)?.name || ''
  }

  export let walletId!: Hex

  let indices: Account[] = []
  let addedList: Account[] = []
  $: {
    wallet.accountsUnder(walletId).then((accounts) => {
      indices = accounts
      addedList = accounts.filter((addr) => addr.added)
    })
  }
  $: added = new Set<number>(addedList.map(({ address_index }) => address_index))
  $: addedInputs = (addedList || []).reduce(
    (mapping, val) => {
      mapping[val.address_index] = true
      return mapping
    },
    {} as Record<string, boolean>,
  )
  $: addressesWithDerivedInfo = indices.map((addr) => {
    const contactName = $contactByAddress.get(addr.address)?.name || ''
    const localName = localContactNames[addr.address]
    return {
      ...addr,
      name: localName === undefined ? contactName : localName,
      contactName,
      localName,
    }
  })
  $: handler = new DataHandler(addressesWithDerivedInfo, { rowsPerPage: 20 })
  $: rows = handler.getRows()

  let localContactNames: Record<Hex, string> = {}
  let changes = {
    added: addedInputs || {}, // {} as Record<number, boolean>,
  }
</script>

<div class="flex">
  <div class="w-full space-y-4 overflow-x-auto">
    <!-- Header -->
    <header class="flex justify-between gap-4">
      <Search {handler} />
      <RowsPerPage {handler} />
    </header>
    <!-- Table -->
    <table class="table table-compact w-full table-auto">
      <thead>
        <tr>
          <th style="padding-right: 0">Added</th>
          <ThFilter placeholder="Address" {handler} filterBy="address" />
          <ThFilter placeholder="Name" {handler} filterBy="name" />
        </tr>
      </thead>
      <tbody>
        {#if !!localContactNames && !!added}
          {#each $rows as row, i}
            <tr>
              <td class="align-middle">
                <span class="flex">
                  <SlideToggle
                    name="address-added-{i}"
                    background="bg-primary-300"
                    active="bg-primary-500"
                    on:change={(e) => toggleIndexAddition(e, row.address_index)}
                    checked={!!addedInputs[row.address_index]}
                    size="sm" />
                </span>
              </td>
              <td class="align-middle">
                <span class="font-mono leading-6">
                  <Copy text={row.address} let:copy>
                    <button type="button" on:click={copy}>
                      {row.address}
                    </button>
                  </Copy>
                </span>
              </td>
              <td class="align-middle leading-6">
                <div class="flex w-full flex-row items-center">
                  <span
                    class="flex w-full leading-6 focus:outline-none focus:ring-0"
                    contenteditable="true"
                    on:input={(e) => updateLocalContactName(e, row.address)}>{addressName(row.address)}</span>
                  <button
                    type="button"
                    class="variant-filled-primary btn size-6 p-1 leading-4"
                    class:hidden={localContactNames[row.address] === undefined}
                    on:click={() => deleteLocalContactName(row.address)}>&times;</button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
    <!-- Footer -->
    <footer class="flex justify-between">
      <RowCount {handler} />
      <Pagination {handler} />
    </footer>
    <Portal target="#sticky-portal">
      <div class="flex w-full flex-row items-center gap-2 bg-primary-50 px-4 py-2 shadow-inner">
        <Back let:back>
          <button type="button" on:click={() => back()} class="variant-outline-primary btn w-full">Cancel</button>
        </Back>
        <button type="button" class="variant-filled-primary btn flex w-full" on:click={onSave}>Save</button>
      </div>
    </Portal>
  </div>
</div>
