<script lang="ts">
  import AddressesTable from '$lib/components/table/Addresses.svelte'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
  import type { Hex } from 'viem'
  export let params!: { walletId: Hex }
</script>

<Crumb {...crumbs.addresses} />

<div class="p-4">
  <AddressesTable walletId={params.walletId} />
</div>
