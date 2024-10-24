<script lang="ts">
  import { encodeFunctionData, type Hex } from 'viem'
  import PowerSelector from '$lib/components/PowerSelector.svelte'
  import TokenBalanceSelector from '$lib/components/TokenBalanceSelector.svelte'
  import { lastPool, poolPower } from '$lib/pools'
  import { PrivacyPoolAbi } from '$common/abis/PrivacyPool'
  import { tokensOnActiveChain } from '$lib/tokens'
  import { Offsets } from '$lib/unit'
  import { commitmentFromAccountSignature, currentAccount as account } from '$lib/wallets'
  import { chain } from '$lib/chain-state'
  import { createEventDispatcher, tick } from 'svelte'
  import { config } from '$lib/config'
  import * as api from '$lib/api'
  const dispatch = createEventDispatcher()

  export let token = $tokensOnActiveChain[0]
  export let balance = 0n
  export let amount = 0n
  export let offset: Offsets = Offsets.Neutral
  export let power = $poolPower || 15

  $: poolAddress = $lastPool[power]
  $: disabled = !poolAddress
  $: token = $tokensOnActiveChain[0]
  $: incrementIn = 10n ** BigInt(power)
  $: limit = balance < incrementIn * 10n ? balance - (balance % incrementIn) : incrementIn * 10n

  const generateCommitment = async (poolAddress: Hex, _amount: bigint) => {
    const commitment = await commitmentFromAccountSignature($account!, $chain!, poolAddress!)
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
  let commitment: Hex | null = null
  $: if (poolAddress && amount) {
    generateCommitment(poolAddress, amount).then((c) => {
      commitment = c
    })
  }
  const dispatchChange = () => {
    dispatch('change')
  }
  let data: Hex | null = null
  let toAddress: Hex | null = null
  $: {
    const commitments = calldataFromCommitment(amount, commitment)
    toAddress = commitments.length ? poolAddress : null
    data = encodeFunctionData({
      abi: PrivacyPoolAbi,
      functionName: 'depositMany',
      args: [commitments],
    })
    tick().then(dispatchChange)
  }
  let clear = 0
  const dispatchPowerChange = (e: CustomEvent<{ value: number }>) => {
    api.config.set(`byChain.${$config.chainId}.poolPower`, e.detail.value)
    power = e.detail.value
    amount = 0n
    clear++
  }
</script>

<div class="flex w-full flex-row justify-start justify-items-start">
  <PowerSelector bind:power on:change={dispatchPowerChange} unit={token.metadata.symbol} />
</div>
<div class="flex flex-row justify-center" class:pointer-events-none={disabled} class:opacity-60={disabled}>
  <TokenBalanceSelector
    on:balance
    showSteps
    showBalance
    {token}
    {limit}
    disableSelector
    bind:clear
    bind:offset
    step={incrementIn}
    bind:amount
    bind:balance>
    <svelte:fragment slot="input">
      <div class="absolute hidden">
        {#if poolAddress && commitment}
          <input type="hidden" name="to-address" id="to-address" value={toAddress} />
          <input type="hidden" name="value" value={amount} />
          <input id="data" name="data" type="hidden" value={data} />
        {/if}
      </div>
    </svelte:fragment>
  </TokenBalanceSelector>
</div>
