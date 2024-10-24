<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips'
  import Number from './Number.svelte'

  export let power!: number
  export let decimals = 18
  export let unit = ''
  export let disabled = false
  $: increment = 10n ** BigInt(power)
</script>

<div class="flex w-full flex-col">
  <span><Number truncateZeros x={increment} {decimals} />{unit}</span>
  <RangeSlider
    on:change
    {disabled}
    bind:value={power}
    min={0}
    max={78}
    step={1}
    pips
    float
    first="label"
    last="label" />
</div>
