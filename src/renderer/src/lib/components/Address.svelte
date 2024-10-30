<script lang="ts">
  import { emptyHex } from '$common/config'
  import { truncatedAddress } from '$lib/address'
  import type { Hex } from 'viem'

  export let address: string | Hex = emptyHex
  $: addr = address as Hex
  $: validAddress = !!address && address !== emptyHex
</script>

<span class="contents" title={addr}>{!validAddress ? '' : truncatedAddress(addr)}</span>
