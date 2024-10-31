<script lang="ts">
  import ToAddressInput from '$lib/components/ToAddressInput.svelte'
  import TokenBalanceSelector from '$lib/components/TokenBalanceSelector.svelte'
  import type { Erc20Token } from '$common/token'
  import { isAddress, encodeFunctionData, erc20Abi, zeroAddress, type Hex } from 'viem'
  import { emptyHex } from '$common/config'

  export let toValue = ''
  export let toAddress: Hex = emptyHex
  export let token: Erc20Token
  export let amount = 0n
  export let balance = 0n
  const erc20GasLimit = 64_000
  const nativeTransferGasLimit = 25_200
</script>

<ToAddressInput on:change bind:toAddress bind:toValue />
<div class="flex w-full flex-col items-center gap-4">
  <div class="flex w-full flex-row justify-center">
    <TokenBalanceSelector on:change limit={balance} showBalance bind:token bind:amount bind:balance>
      <!-- must use absolute here to get out of flex flow -->
      <svelte:fragment slot="input">
        <div class="absolute hidden">
          <input
            type="hidden"
            name="to-address"
            id="to-address"
            on:change
            value={token.address === zeroAddress ? toAddress : token.address}
          />
          <input type="hidden" id="value" name="value" value={token.address === zeroAddress ? amount : 0n} on:change />
          <input
            type="hidden"
            id="gas"
            name="gas"
            value={token.address === zeroAddress ? nativeTransferGasLimit : erc20GasLimit}
            on:change
          />
          <input
            id="data"
            name="data"
            type="hidden"
            on:change
            value={token.address === zeroAddress
              ? emptyHex
              : isAddress(toAddress)
                ? encodeFunctionData({
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [toAddress, amount],
                  })
                : null}
          />
        </div>
      </svelte:fragment>
    </TokenBalanceSelector>
  </div>
</div>
