<script lang="ts">
  import SettingList from '$lib/components/SettingList.svelte'
  import type { Section } from '$lib/link-list'
  import { sections as sectionMapping } from '$lib/sections'
  // import { currentWalletIndex } from '$lib/wallets'
  import { config } from '$lib/config'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'

  $: sections = [
    sectionMapping.navigation(),
    sectionMapping.account(),
    // security sections
    sectionMapping.security(),
    // address sections
    sectionMapping.addresses($config.walletId!),
    sectionMapping.secrets(),
  ] as Section[]
</script>

<Crumb {...crumbs.more} />

<div class="p-4">
  <SettingList {sections} />
</div>
