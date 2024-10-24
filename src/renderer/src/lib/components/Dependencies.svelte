<script lang="ts">
  import { initializeStores, Drawer, Toast, Modal, getDrawerStore } from '@skeletonlabs/skeleton'

  import { storePopup } from '@skeletonlabs/skeleton'
  import { arrow, autoUpdate, computePosition, offset, shift, flip } from '@floating-ui/dom'
  // import Icon from '@iconify/svelte'

  // import '../app.css'
  import UnitDrawer from '$lib/components/UnitDrawer.svelte'
  import TokenSelect from '$lib/components/TokenSelect.svelte'
  import ContactSelect from '$lib/components/ContactSelect.svelte'
  import ContactUpsert from '$lib/components/ContactUpsert.svelte'
  import NetworkSelect from '$lib/components/NetworkSelect.svelte'
  import AccountSelect from '$lib/components/AccountSelect.svelte'
  import SecretShow from '$lib/components/SecretShow.svelte'
  import Block from '$lib/components/Block.svelte'
  import { chain } from '$lib/chain-state'

  import '$lib/components/icon-data'

  import { onMount } from 'svelte'

  const chainUnsubscribe = chain.subscribe(($chain) => {
    const theme = $chain.id === 1 ? 'wintry' : 'gold-nouveau'
    document.body.setAttribute('data-theme', theme)
  })
  onMount(() => {
    // ponder.init()
    return () => {
      chainUnsubscribe()
    }
  })
  initializeStores()
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
  const drawerStore = getDrawerStore()
</script>

<Drawer>
  {#if $drawerStore.id === 'unit'}
    <UnitDrawer {...$drawerStore.meta} />
  {:else if $drawerStore.id === 'token'}
    <TokenSelect {...$drawerStore.meta} />
  {:else if $drawerStore.id === 'contact-select'}
    <ContactSelect {...$drawerStore.meta} />
  {:else if $drawerStore.id === 'contact-upsert'}
    <ContactUpsert {...$drawerStore.meta} />
  {:else if $drawerStore.id === 'network-select'}
    <NetworkSelect {...$drawerStore.meta} />
  {:else if $drawerStore.id === 'account-select'}
    <AccountSelect {...$drawerStore.meta} />
  {:else if $drawerStore.id === 'secret-show'}
    <SecretShow {...$drawerStore.meta} />
  {/if}
</Drawer>

<Modal />

<Toast />

<Block />

<slot />
