<script lang="ts">
  import { zeroAddress, encodeFunctionData, type Hex } from 'viem'
  import { createEventDispatcher, tick } from 'svelte'

  import PowerSelector from '$lib/components/PowerSelector.svelte'
  import TokenBalanceSelector from '$lib/components/TokenBalanceSelector.svelte'
  import { poolPower, latestPoolUnderPower, factory } from '$lib/pools'
  import { PrivacyPoolAbi } from '$common/abis/PrivacyPool'
  import { tokensOnActiveChain } from '$lib/tokens'
  import { Offsets } from '$lib/unit'
  import { currentAccount as account } from '$lib/wallets'
  import { chain, currentBlock } from '$lib/chain-state'
  import { updatePower } from '$lib/config'
  import * as api from '$lib/api'
  import type { ChainIds } from '$common/config'
  import { PrivacyPoolFactoryAbi } from '$common/abis/PrivacyPoolFactory'
  import { maxTotalDeposits, native } from '$common/pools'

  const dispatch = createEventDispatcher()

  const dispatchChange = () => {
    dispatch('change')
  }
  const dispatchPowerChange = (e: CustomEvent<{ value: number }>) => {
    updatePower(e.detail.value)
    amount = 0n
    amountDecimal = ''
  }
  const generateCommitment = async (poolAddress: Hex) => {
    const commitment = await api.pool.commitmentFromAccountSignature($account!, $chain?.id as ChainIds, poolAddress!)
    return commitment
  }
  const calldataFromCommitment = (amount: bigint, commitment: Hex | null) => {
    if (!commitment) {
      return []
    }
    const denomination = 10n ** BigInt(power)
    const n = amount / denomination
    return new Array<Hex>(Number(n)).fill(commitment)
  }

  export let token = $tokensOnActiveChain[0]
  export let balance = 0n
  export let amount = 0n
  export let offset: Offsets = Offsets.Neutral
  export let power = $poolPower || 15
  export let canDeposit: boolean | null = null

  $: {
    power = $poolPower || 15
  }

  $: token = $tokensOnActiveChain[0]
  $: incrementIn = 10n ** BigInt(power)
  $: truncatedBalance = balance - (balance % incrementIn)
  $: maxDeposits = $latestPoolUnderPower ? maxTotalDeposits - BigInt($latestPoolUnderPower.leafIndex) : 10n
  $: poolAddress = ($latestPoolUnderPower?.address as Hex) || null
  $: depositLimit = maxDeposits < 10n ? maxDeposits : 10n
  $: limit =
    truncatedBalance < incrementIn * depositLimit
      ? truncatedBalance - (truncatedBalance % incrementIn)
      : incrementIn * depositLimit
  $: {
    canDeposit = !!poolAddress && depositLimit > 0n
    dispatchChange()
  }
  $: if ($currentBlock) {
    dispatchChange()
  }

  let commitment: Hex | null = null
  $: if (poolAddress) {
    // move this to a store
    generateCommitment(poolAddress).then((c) => {
      commitment = c
    })
  }
  let data: Hex | null = null
  let toAddress: Hex | null = null
  let commitments: Hex[] = []
  let amountDecimal = ''
  $: {
    commitments = calldataFromCommitment(amount, commitment)
    toAddress = commitments.length ? poolAddress : null
    data = encodeFunctionData({
      abi: PrivacyPoolAbi,
      functionName: 'depositMany',
      args: [commitments],
    })
    tick().then(dispatchChange)
  }
  $: tokenAddress = token.address === zeroAddress ? native : token.address
  $: deployData = encodeFunctionData({
    abi: PrivacyPoolFactoryAbi,
    functionName: 'createPool',
    args: [tokenAddress, BigInt(power)],
  })
</script>

<div class="flex w-full flex-row justify-start justify-items-start">
  <PowerSelector {power} on:change={dispatchPowerChange} unit={token.metadata.symbol} />
</div>
<div class="flex flex-row justify-center" class:pointer-events-none={!canDeposit} class:opacity-60={!canDeposit}>
  <TokenBalanceSelector
    on:balance
    maxTitle="Max that can be shielded in one transaction"
    showSteps
    showBalance
    {token}
    {limit}
    disableSelector
    bind:amountDecimal
    bind:offset
    step={incrementIn}
    bind:amount
    bind:balance>
    <svelte:fragment slot="input">
      <div class="absolute hidden">
        {#if !canDeposit}
          <input type="hidden" name="to-address" id="to-address" value={$factory?.address} />
          <input type="hidden" name="value" id="value" value={0n} />
          <input type="hidden" name="gas" id="gas" value={6_000_000} />
          <input type="hidden" id="data" name="data" value={deployData} />
        {:else if poolAddress && commitment}
          <input type="hidden" name="to-address" id="to-address" value={toAddress} />
          <input type="hidden" name="value" value={amount} />
          <input type="hidden" name="gas" id="gas" value={1_000_000 * commitments.length} />
          <input type="hidden" id="data" name="data" value={data} />
        {/if}
      </div>
    </svelte:fragment>
  </TokenBalanceSelector>
</div>
