<script lang="ts">
  import { formatUnits } from 'viem'

  export let previous = 0n
  export let current = 0n
  $: basisPointsDelta = previous ? current / (previous / 10_000n) - 10_000n : 0n
  $: belowPoint1 = basisPointsDelta < -10n
  $: abovePoint1 = basisPointsDelta > 10n
  $: decimal = formatUnits(basisPointsDelta, 2)
</script>

<span class:text-red-600={belowPoint1} class:text-green-600={abovePoint1}>
  {decimal}%
</span>
