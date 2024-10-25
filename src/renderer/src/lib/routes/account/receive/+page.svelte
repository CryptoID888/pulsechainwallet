<script lang="ts">
  import TokenBalanceSelector from '$lib/components/TokenBalanceSelector.svelte'
  import { currentAccount } from '$lib/wallets'
  import QRCode from '@castlenine/svelte-qrcode'
  import { tokensOnActiveChain } from '$lib/tokens'
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
  import { chain } from '$lib/chain-state'
  let token = $tokensOnActiveChain[0]
  $: if ($chain) {
    token = $tokensOnActiveChain[0]
  }
</script>

<Crumb {...crumbs.receive} />

{#if $currentAccount?.address}
  <div class="flex w-full flex-col items-center justify-center gap-4 p-4">
    <TokenBalanceSelector {token} />
    <div class="flex">
      <QRCode data={$currentAccount.address} />
    </div>
    <p class="font-mono">{$currentAccount.address}</p>
  </div>
{/if}
