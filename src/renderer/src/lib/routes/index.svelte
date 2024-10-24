<script lang="ts">
  import Router from 'svelte-spa-router'
  import Index from './+page.svelte'
  import Locked from './locked/+page.svelte'
  import LockedLoad from './locked/load/+page.svelte'
  import LockedCreate from './locked/create/+page.svelte'
  import LockedRestore from './locked/restore/+page.svelte'
  import LockedLogin from './locked/login/+page.svelte'
  import Lock from './lock/+page.svelte'
  // import Account from './account/+page.svelte'
  // import AccountSecurity from './account/security/+page.svelte'
  // import AccountAddressesManage from './account/addresses/manage/+page.svelte'
  // import AccountAddressesPath from './account/addresses/path/+page.svelte'
  // import AccountAddressesPhraseCreate from './account/addresses/phrase/create/+page.svelte'
  // import AccountAddressesPhraseImport from './account/addresses/phrase/import/+page.svelte'
  // import AccountAddressesPrivateKeyCreate from './account/addresses/private-key/create/+page.svelte'
  // import AccountAddressesPrivateKeyImport from './account/addresses/private-key/import/+page.svelte'
  // import AccountAddressesToggle from './account/addresses/wallet_index/toggle/+page.svelte'
  // import AccountAddressesDetail from './account/addresses/wallet_index/detail/address_index/+page.svelte'
  // import AccountSettings from './account/settings/+page.svelte'
  // import AccountMore from './account/more/+page.svelte'
  // import AccountBridge from './account/bridge/+page.svelte'
  // import AccountSend from './account/send/+page.svelte'
  // import AccountReceive from './account/receive/+page.svelte'
  // import AccountShield from './account/shield/+page.svelte'
  import AccountLayout from './account/+layout.svelte'
  // import { isHex, type Hex } from 'viem'
  import type { SvelteComponent } from 'svelte'
  // let url = '/'
  // const walletId = (id: string) => {
  //   if (!isHex(id)) {
  //     console.warn('Invalid wallet id', id)
  //   }
  //   return id as Hex
  // }
  // $: if (!url || url === '/') {
  //   console.log('url missing', url)
  //   url = '/locked'
  // }
  // $: console.log('url', url)
  const routes = new Map<string, SvelteComponent>()
  routes.set('/', Index as unknown as SvelteComponent)
  routes.set('/locked', Locked as unknown as SvelteComponent)
  routes.set('/locked/load', LockedLoad as unknown as SvelteComponent)
  routes.set('/locked/create', LockedCreate as unknown as SvelteComponent)
  routes.set('/locked/restore', LockedRestore as unknown as SvelteComponent)
  routes.set('/locked/login', LockedLogin as unknown as SvelteComponent)
  routes.set('/lock', Lock as unknown as SvelteComponent)
  routes.set('/account', AccountLayout as unknown as SvelteComponent)
  routes.set('/account/*', AccountLayout as unknown as SvelteComponent)
  // routes.set('/account/*', AccountLayout as unknown as SvelteComponent)
</script>

<Router {routes} />
<!-- routes that you do not need to be logged in to access -->
<!-- routes that you need to be logged in to access -->
<!-- <Router {url}>
  <Route path="/" component={Index} />
  <Route path="/locked" component={Locked} />
  <Route path="/locked/load" component={LockedLoad} />
  <Route path="/locked/create" component={LockedCreate} />
<Route path="/locked/restore" component={LockedRestore} />
  <Route path="/locked/login">
    <LockedLogin />
  </Route>
  <Route path="/lock" component={Lock} />
  <Route path="/account">
    <AccountLayout>
      <Account />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/manage">
    <AccountLayout>
      <AccountAddressesManage />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/path">
    <AccountLayout>
      <AccountAddressesPath />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/phrase/create">
    <AccountLayout>
      <AccountAddressesPhraseCreate />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/phrase/import">
    <AccountLayout>
      <AccountAddressesPhraseImport />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/private-key/create">
    <AccountLayout>
      <AccountAddressesPrivateKeyCreate />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/private-key/import">
    <AccountLayout>
      <AccountAddressesPrivateKeyImport />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/:walletId/detail/:addressIndex" let:params>
    <AccountLayout>
      <AccountAddressesDetail walletId={walletId(params.walletId)} addressIndex={+params.addressIndex} />
    </AccountLayout>
  </Route>
  <Route path="/account/addresses/:walletIndex/toggle" let:params>
    <AccountLayout>
      <AccountAddressesToggle walletIndex={+params.walletIndex} />
    </AccountLayout>
  </Route>
  <Route path="/account/bridge">
    <AccountLayout>
      <AccountBridge />
    </AccountLayout>
  </Route>
  <Route path="/account/more">
    <AccountLayout>
      <AccountMore />
    </AccountLayout>
  </Route>
  <Route path="/account/receive">
    <AccountLayout>
      <AccountReceive />
    </AccountLayout>
  </Route>
  <Route path="/account/security">
    <AccountLayout>
      <AccountSecurity />
    </AccountLayout>
  </Route>
  <Route path="/account/send">
    <AccountLayout>
      <AccountSend />
    </AccountLayout>
  </Route>
  <Route path="/account/settings">
    <AccountLayout>
      <AccountSettings />
    </AccountLayout>
  </Route>
  <Route path="/account/shield">
    <AccountLayout>
      <AccountShield />
    </AccountLayout>
  </Route>
</Router> -->
