<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips'
  import Number from './Number.svelte'
  import StepIncrementor from './StepIncrementor.svelte'
  import { maxPower } from '$common/pools'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let power!: number
  export let decimals = 18
  export let unit = ''
  export let disabled = false

  $: increment = 10n ** BigInt(power)

  const handleIncrement = (e: CustomEvent<bigint>) => {
    power += global.Number(e.detail)
    dispatch('change', {
      value: power,
    })
  }
</script>

<div class="flex w-full flex-col">
  <div class="w-full flex flex-row">
    <div class="flex flex-row flex-grow-0 items-center">
      <div class="input-group flex flex-col-reverse">
        <!-- decrement class is only needed because i couldn't find the vertical variant -->
        <StepIncrementor
          decrementDisabled={power === 0}
          incrementDisabled={power === maxPower}
          on:change={handleIncrement}
          decrementClass="border-t border-primary-400 rounded-t-none" />
      </div>
    </div>
    <div class="flex flex-col w-full">
      <span class="px-4"><Number truncateZeros x={increment} {decimals} />{unit}</span>
      <div class="flex flex-row flex-grow w-full">
        <RangeSlider
          on:change
          {disabled}
          bind:value={power}
          min={0}
          max={maxPower}
          step={1}
          pips
          float
          first="label"
          last="label" />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(.rangeSlider) {
    @apply w-full;
  }
</style>
