<script lang="ts">
  import TokenBalanceSelector from '$lib/components/TokenBalanceSelector.svelte'
  import { currentAccount } from '$lib/wallets'
  import QRCode from '@castlenine/svelte-qrcode'
  import * as tokens from '$lib/tokens'
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'

  $: token = tokens.whitelistedERC20[0]
</script>

<Crumb {...crumbs.receive} />

<div class="flex w-full flex-col items-center justify-center gap-4 p-4">
  <TokenBalanceSelector bind:token />
  <div class="flex">
    {#if $currentAccount?.address}
      <QRCode data={$currentAccount.address} />
    {/if}
  </div>
  <p class="font-mono">{$currentAccount.address}</p>
</div>
