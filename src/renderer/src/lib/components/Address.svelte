<script lang="ts">
  import { truncatedAddress } from '$lib/address'
  import type { Hex } from 'viem'

  export let address: string | Hex = '0x'
  $: addr = address as Hex
  $: validAddress = !!address && address !== '0x'
</script>

{!validAddress ? '' : truncatedAddress(addr)}
