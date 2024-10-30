<script lang="ts">
  import Router from 'svelte-spa-router'
  import Index from './+page.svelte'
  import Locked from './locked/+page.svelte'
  import LockedLoad from './locked/load/+page.svelte'
  import LockedCreate from './locked/create/+page.svelte'
  import LockedRestore from './locked/restore/+page.svelte'
  import LockedLogin from './locked/login/+page.svelte'
  import Lock from './lock/+page.svelte'
  import AccountLayout from './account/+layout.svelte'
  import type { SvelteComponent } from 'svelte'
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
</script>

<Router {routes} />
