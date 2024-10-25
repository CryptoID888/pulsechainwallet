<script lang="ts">
  import { push } from 'svelte-spa-router'
  import AccountList from '$lib/components/AccountList.svelte'
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
  import { currentAccount, wallets, addedAccountsByWalletId } from '$lib/wallets'
  import { config } from '$lib/config'
  import * as api from '$lib/api'
  import Icon from '@iconify/svelte'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import Portal from 'svelte-portal'
  import type { Account, SeedType, WalletMetadata } from '$common/wallets'
  import IconList from '$lib/components/IconList.svelte'

  const selectAddress = (e: CustomEvent<Account>) => {
    api.config.set('.', {
      walletId: selectedWallet.id,
      addressIndex: e.detail.address_index,
    })
  }
  const navToAddAddresses = () => {
    push(`/account/addresses/${selectedWallet.id}/toggle`)
  }
  const navToAddWallet = () => {
    push(`/account/more`)
  }
  const drawerStore = getDrawerStore()
  const showPhrase = () => {
    drawerStore.open({
      id: 'secret-show',
      position: 'bottom',
      meta: {
        walletId: selectedWallet.id,
      },
    })
  }
  const showDeleteOptions = () => {}

  type Icon = {
    badge: number
    type: SeedType
    id: string
  }

  let accounts: Account[] = []
  let secretMetadata: WalletMetadata | null = null
  let icons: Icon[] = []
  let selectedIcon: Icon | null = null

  let selectedWallet = $wallets.find((w) => w.id === $config.walletId) || $wallets[0]
  const handleSelectWallet = (e: CustomEvent<WalletMetadata>) => {
    selectedWallet = e.detail
  }
  $: if (!selectedWallet) {
    selectedWallet = $wallets[0]
  }
  $: if ($config && $wallets.length) {
    if (selectedWallet) {
      accounts = $addedAccountsByWalletId[selectedWallet.id] || []
      secretMetadata = $wallets?.[selectedWallet.id]
      icons = $wallets.map((metadata) => ({
        badge: $addedAccountsByWalletId[metadata.id]?.length || 0,
        type: metadata.type,
        id: metadata.id,
      }))
      selectedIcon = icons.find((i) => i.id === selectedWallet.id)
    }
  }
</script>

<Crumb {...crumbs.addresses} />
<Crumb {...crumbs.manageAddresses} />

<div class="flex flex-col gap-2 p-4">
  <div class="flex flex-row">
    <IconList {icons} selected={selectedIcon} on:select={handleSelectWallet} />
    <button type="button" class="btn" on:click={navToAddWallet}>
      <Icon icon="mdi:wallet-add-outline" height={24} />
    </button>
  </div>
  <div class="flex flex-row justify-between gap-2">
    <h3 class="h3">{secretMetadata?.type === 'pk' ? 'Private Key' : 'Seed Phrase'}</h3>
    <div class="flex flex-row gap-2">
      <button type="button" class="variant-soft-primary btn px-2" on:click={navToAddAddresses}>
        <Icon icon="ic:baseline-plus" />
      </button>
      <button type="button" class="variant-soft-primary btn px-2" on:click={showPhrase}>
        <Icon icon="mdi:eye-lock-open-outline" />
      </button>
      <button type="button" class="variant-soft-primary btn px-2" disabled on:click={showDeleteOptions}>
        <Icon icon="mdi:garbage-can-outline" />
      </button>
    </div>
  </div>
  {#if $currentAccount && accounts.length}
    <AccountList
      {accounts}
      walletId={selectedWallet.id}
      currentAddress={$currentAccount.address}
      on:select={selectAddress} />
  {:else}
    <Portal target="#sticky-portal">
      <div class="flex w-full bg-primary-50 px-4 py-2">
        <button type="button" class="variant-filled-primary btn w-full" on:click={navToAddAddresses}
          >Add Addresses</button>
      </div>
    </Portal>
  {/if}
</div>
