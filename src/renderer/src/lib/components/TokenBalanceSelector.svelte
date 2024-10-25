<script lang="ts">
  import type { Erc20Token } from '$common/token'
  import { delimiter } from '$lib/modifiers/delimiter'
  import TokenBalance from '$lib/components/TokenBalance.svelte'
  import { currentAccount } from '$lib/wallets'
  import Unit from './Unit.svelte'
  import TokenSelector from './TokenSelector.svelte'
  import { Offsets } from '$lib/unit'
  import { chainIdToChain } from '$lib/chain-state'
  import { parseUnits, formatUnits } from 'viem'
  import { sanitizeDecimal } from '$lib/number'
  import PriceFetch from './PriceFetch.svelte'
  import Number from './Number.svelte'
  import InfoBubble from './InfoBubble.svelte'
  import Loading from './Loading.svelte'
  import StepIncrementor from './StepIncrementor.svelte'
  import { createEventDispatcher } from 'svelte'

  const oneEther = 10n ** 18n
  const dispatch = createEventDispatcher()
  const useMax = () => {
    let amount = limit === null ? balance : limit
    if (step > 1n) {
      amount -= amount % step
    }
    const nextAmountDecimal = formatUnits(amount, decimals)
    if (nextAmountDecimal !== amountDecimal) {
      amountDecimal = nextAmountDecimal
      dispatch('change', amountDecimal)
    }
  }
  const handleStepChange = (e: CustomEvent<bigint>) => {
    if (!amountDecimal && e.detail < 0n) return
    let newAmount = amount + step * e.detail
    if (newAmount < 0n) newAmount = 0n
    const nextAmountDecimal = formatUnits(newAmount, decimals)
    if (nextAmountDecimal !== amountDecimal) {
      amountDecimal = nextAmountDecimal
      dispatch('change', amountDecimal)
    }
  }

  export let disableInput = false
  export let offset: Offsets = Offsets.Neutral
  export let showBalance = false
  export let token!: Erc20Token
  export let balance = 0n
  export let limit: null | bigint = null
  export let amount = 0n
  export let disableSelector = false
  export let step = 1n
  export let showSteps = false

  export let amountDecimal = ''
  let price = oneEther

  $: decimals = token.metadata!.decimals || 18
  $: if (limit !== null) {
    const sanitizedAmount = amountDecimal ? sanitizeDecimal(amountDecimal) : amountDecimal
    const currentAmount = amountDecimal ? parseUnits(sanitizedAmount, decimals) : 0n
    if (currentAmount > limit) {
      amountDecimal = formatUnits(limit, decimals)
    }
  }
  $: chainName = chainIdToChain.get(+token.chain.id)!.name
  $: amount = amountDecimal ? parseUnits(sanitizeDecimal(amountDecimal), decimals) : 0n
  $: decrementDisabled = amount - step < 0n
  $: incrementDisabled = limit !== null && amount + step > limit
  // price is always formatted with 18 decimals when int
  $: totalValueUSD = price * amount
  $: value = parseUnits(sanitizeDecimal(amountDecimal), decimals)

  const handleTokenChange = (e: CustomEvent<Erc20Token>) => {
    token = e.detail
  }
</script>

{#if $currentAccount}
  <div class="flex w-full flex-col items-start">
    {#if showBalance}
      <span class="flex w-full flex-row justify-between text-sm">
        <span class="flex">
          <span class="font-medium italic">Balance:&nbsp;</span>
          {#if $currentAccount.address}
            <TokenBalance on:balance {token} address={$currentAccount.address} bind:balance />
          {/if}
        </span>
        <span>
          <button
            type="button"
            class="flex flex-row items-center gap-2 px-2 uppercase text-primary-700 hover:text-primary-500"
            on:click={useMax}>
            <span>Max</span>
            {#if limit !== null}
              <Number x={limit} />
            {/if}
          </button>
        </span>
      </span>
    {/if}
    <div class="flex w-full flex-grow">
      <TokenSelector bind:token on:change={handleTokenChange} disabled={disableSelector} />
      <div class="variant-soft-rec input-group input-group-divider flex grid-cols-[auto_1fr_auto] items-center">
        {#if showSteps}
          <StepIncrementor {decrementDisabled} {incrementDisabled} on:change={handleStepChange} />
        {/if}
        <input
          type="text"
          id="amount"
          name="amount"
          class="flex flex-grow pr-0 text-right"
          disabled={disableInput}
          use:delimiter={{ decimals, min: 0n, max: limit === null ? undefined : limit, step }}
          placeholder={decimals !== -window.Number(+offset) ? '0.0' : '0'}
          bind:value={amountDecimal} />
        <Unit {token} bind:offset />
        <input class="hidden" type="hidden" id="value" name="value" {value} />
        <slot name="input" {token} {balance} amount={value} />
      </div>
    </div>
    <InfoBubble>
      <svelte:fragment slot="after-caret">
        <span class="py-1">$<Number x={totalValueUSD / oneEther} /></span>
      </svelte:fragment>
      <div class="flex flex-row justify-between">
        <span class="flex h-5">Chain</span>
        <span class="flex h-5">{chainName}</span>
      </div>
      <div class="flex flex-row justify-between">
        <span class="flex h-5">Price</span>
        <span class="flex h-5 justify-end">
          {#if !price}
            <Loading key="price" size={16} />
          {/if}
          $<Number decimals={18} x={price} />
        </span>
      </div>
    </InfoBubble>
    <PriceFetch bind:price bind:token />
  </div>
{/if}
