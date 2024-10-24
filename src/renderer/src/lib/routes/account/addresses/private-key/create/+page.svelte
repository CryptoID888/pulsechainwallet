<script lang="ts">
  import PrivateKeyInput from '$lib/components/PrivateKeyInput.svelte'
  import { generatePrivateKey } from 'viem/accounts'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
  import { location } from 'svelte-spa-router'
  let value = generatePrivateKey()
</script>

<Crumb {...crumbs.addresses} />
<Crumb {...crumbs.key($location)} />

<div class="flex flex-col gap-2 p-4">
  <h3 class="h3 flex w-full justify-center">Create Private Key</h3>
  <PrivateKeyInput action="Create" {value} showRefresh />
</div>
