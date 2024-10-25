<script lang="ts">
  import Icon from '@iconify/svelte'
  import AccountSummary from '$lib/components/account/Summary.svelte'
  import { currentAccount } from '$lib/wallets'
  import { crumbs, type Crumb } from '$lib/navigation'
  import { link } from 'svelte-spa-router'
  const actions: Crumb[] = [
    // send crypto
    crumbs.send,
    // shield crypto
    crumbs.shield,
    crumbs.broadcast,
    // receive crypto
    crumbs.receive,
    // view transactions
    crumbs.transactions,
    // more options / settings
    crumbs.more,
  ]
</script>

{#if $currentAccount}
  <div class="flex w-full px-4">
    <AccountSummary account={$currentAccount} />
  </div>
{/if}
<div class="flex w-full justify-center px-4 pb-10">
  <div class="grid grid-cols-3 grid-rows-2 text-center">
    {#each actions as nav}
      <div class="flex h-24 w-28 flex-col items-center">
        <a use:link href={nav.link} class="flex w-full flex-grow items-center hover:bg-primary-100">
          <div class="flex w-full flex-col items-center px-2 py-4">
            <div class="flex size-6 items-center justify-center">
              <Icon scale={2} icon={nav.icon} height={nav.iconSize} />
            </div>
            <span class="w-full">{nav.text}</span>
          </div>
        </a>
      </div>
    {/each}
  </div>
</div>
