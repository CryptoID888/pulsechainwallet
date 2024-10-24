<script lang="ts">
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
  import SendTransaction from '$lib/components/SendTransaction.svelte'
  import Shield from '$lib/components/transaction/pathways/Shield.svelte'
  import { poolPower } from '$lib/pools'
  import { Offsets } from '$lib/unit'

  let balance = 0n
  let amount = 0n
  let offset: Offsets = Offsets.Neutral
  let power = $poolPower || 15
</script>

<Crumb {...crumbs.shield} />
<SendTransaction let:updatePrep action="shield">
  <Shield
    on:change={() => {
      updatePrep()
    }}
    bind:balance
    bind:amount
    bind:offset
    bind:power />
</SendTransaction>
