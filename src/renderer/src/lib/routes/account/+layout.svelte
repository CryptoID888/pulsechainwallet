<script lang="ts">
  import _ from 'lodash'
  import Crumb from '$lib/components/Crumb.svelte'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import { crumbs } from '$lib/navigation'
  import { onMount, SvelteComponent } from 'svelte'
  import { loading as l } from '$lib/loading'
  import { checkWallets } from '$lib/wallets'
  import ConnectionSummary from '$lib/components/connection/Summary.svelte'
  import { stickyFilled } from '$lib/ui'
  import Account from './+page.svelte'

  import Router, { type WrappedComponent } from 'svelte-spa-router'

  import AccountSecurity from './security/+page.svelte'
  import AccountAddressesManage from './addresses/manage/+page.svelte'
  import AccountAddressesToggle from './addresses/wallet_id/toggle/+page.svelte'
  import AccountAddressesDetail from './addresses/wallet_id/detail/address_index/+page.svelte'
  import AccountAddressesPhraseCreate from './addresses/phrase/create/+page.svelte'
  import AccountAddressesPhraseImport from './addresses/phrase/import/+page.svelte'
  import AccountAddressesPKCreate from './addresses/private-key/create/+page.svelte'
  import AccountAddressesPKImport from './addresses/private-key/import/+page.svelte'
  import AccountMore from './more/+page.svelte'
  import AccountReceive from './receive/+page.svelte'
  import AccountSend from './send/+page.svelte'
  import AccountSettings from './settings/+page.svelte'
  import AccountShield from './shield/+page.svelte'
  import AccountShieldWork from './shield/work/+page.svelte'
  import AccountShieldAssist from './shield/assist/+page.svelte'
  import AccountTransactions from './transactions/+page.svelte'
  import AccountTransactionsDetail from './transactions/detail/+page.svelte'
  import AccountShieldBroadcast from './shield/broadcast/+page.svelte'

  import AccountChangePassword from './security/change-password/+page.svelte'
  import LocationSaver from '$lib/components/LocationSaver.svelte'

  const routes = new Map<string, SvelteComponent | WrappedComponent>()
  const prefix = '/account'
  routes.set('/', Account as unknown as SvelteComponent)
  routes.set('/security', AccountSecurity as unknown as SvelteComponent)
  routes.set('/addresses/phrase/create', AccountAddressesPhraseCreate as unknown as SvelteComponent)
  routes.set('/addresses/phrase/import', AccountAddressesPhraseImport as unknown as SvelteComponent)
  routes.set('/addresses/private-key/create', AccountAddressesPKCreate as unknown as SvelteComponent)
  routes.set('/addresses/private-key/import', AccountAddressesPKImport as unknown as SvelteComponent)
  routes.set('/addresses/manage', AccountAddressesManage as unknown as SvelteComponent)
  routes.set('/addresses/:walletId/toggle', AccountAddressesToggle as unknown as SvelteComponent)
  routes.set('/addresses/:walletId/detail/:addressIndex', AccountAddressesDetail as unknown as SvelteComponent)
  // routes.set('/addresses', AccountAddressesManage as unknown as SvelteComponent)
  routes.set('/more', AccountMore as unknown as SvelteComponent)
  routes.set('/receive', AccountReceive as unknown as SvelteComponent)
  routes.set('/send', AccountSend as unknown as SvelteComponent)
  routes.set('/settings', AccountSettings as unknown as SvelteComponent)
  routes.set('/shield', AccountShield as unknown as SvelteComponent)
  routes.set('/shield/assist', AccountShieldAssist as unknown as SvelteComponent)
  routes.set('/shield/work', AccountShieldWork as unknown as SvelteComponent)
  routes.set('/shield/work/:poolId', AccountShieldWork as unknown as SvelteComponent)
  routes.set('/transactions', AccountTransactions as unknown as SvelteComponent)
  routes.set('/security/change-password', AccountChangePassword as unknown as SvelteComponent)
  routes.set('/transactions/:chainId/:hash', AccountTransactionsDetail as unknown as SvelteComponent)

  routes.set('/shield/broadcast', AccountShieldBroadcast as unknown as SvelteComponent)

  onMount(checkWallets)

  export let params = {}
  _.noop(params)
</script>

<LocationSaver prefix="account" />

<Crumb {...crumbs.account} />

<div class="flex h-full w-full grow flex-col overflow-scroll" class:mb-10={!$stickyFilled} class:mb-24={$stickyFilled}>
  <div class="relative flex w-full flex-col gap-y-2">
    <div class="flex w-full flex-row border-b px-4">
      <Breadcrumbs />
      <div class="flex size-10 items-center justify-center">
        <span class="flex opacity-0 transition-opacity duration-100" class:opacity-100={!$l.isResolved()}>
          <Loader />
        </span>
      </div>
    </div>
    <Router {routes} {prefix} />
  </div>
</div>
<div class="fixed bottom-10 mt-auto w-full" id="sticky-portal"></div>
<footer class="fixed bottom-0 w-full">
  <ConnectionSummary />
</footer>
