<script lang="ts">
  import Copy from '../Copy.svelte'
  import type { Account } from '$common/wallets'
  import Icon from '@iconify/svelte'
  import AccountDetailSummary from '$lib/components/account/DetailSummary.svelte'
  import { getDrawerStore } from '@skeletonlabs/skeleton'

  export let account!: Account

  const drawerStore = getDrawerStore()
  const openSelectAccount = () => {
    drawerStore.open({
      id: 'account-select',
      position: 'bottom',
      meta: { current: account },
    })
  }
</script>

<div class="flex w-full gap-2">
  <button
    on:click={openSelectAccount}
    type="button"
    class="flex w-full items-center justify-between gap-2 rounded-md bg-primary-400 p-2 leading-7 text-primary-50"
  >
    <AccountDetailSummary {account} />
    <Icon icon="material-symbols:chevron-right" height={24} />
  </button>
  <Copy text={account?.address} let:copy let:copied>
    <button type="button" class="variant-soft-primary rounded px-4 py-3" on:click={copy}>
      {#if copied}
        <Icon icon="icon-park-outline:file-success-one" height={16} width={16} />
      {:else}
        <Icon icon="fa:copy" height={16} width={16} />
      {/if}
    </button>
  </Copy>
</div>
