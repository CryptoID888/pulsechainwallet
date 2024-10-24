<script lang="ts">
  import { location } from 'svelte-spa-router'
  import PrivateKeyInput from '$lib/components/PrivateKeyInput.svelte'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
</script>

<Crumb {...crumbs.addresses} />
<Crumb {...crumbs.key($location)} />

<div class="flex flex-col gap-2 p-4">
  <h3 class="h3 flex w-full justify-center">Import Private Key</h3>
  <PrivateKeyInput action="Import" showBack />
</div>
