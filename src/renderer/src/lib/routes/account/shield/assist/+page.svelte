<script lang="ts">
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
  import SendTransaction from '$lib/components/SendTransaction.svelte'
  import Assist from '$lib/components/transaction/pathways/Assist.svelte'
</script>

<Crumb {...crumbs.work} />
<Crumb {...crumbs.assist} />

<SendTransaction let:updatePrep action="assist">
  <Assist on:change={updatePrep} />
</SendTransaction>
