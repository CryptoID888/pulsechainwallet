<script lang="ts">
  import { addDelimiter, joinNumber } from '$lib/number'
  import { config } from '$lib/config'
  import { formatUnits } from 'viem'

  const setSize = 3

  export let x = 0n
  export let decimals = 18
  export let delimiter = $config.digitGroupSeparator
  export let maxDelimiterSets = $config.maxDelimiterSets
  export let maxDecimalDigits = setSize * maxDelimiterSets
  export let truncateZeros = false

  const unusedSets = (int: string) => {
    let unused = 0
    let set = int.slice(0, setSize)
    while (set && BigInt(set) === 0n) {
      unused += 1
      const nextStart = unused * setSize
      set = int.slice(nextStart, nextStart + setSize)
    }
    return unused
  }

  const shortenUnusedZeros = (decimals: string) => {
    let count = 0
    let adding = false
    for (let i = 0; i < decimals.length; i++) {
      const digit = decimals[i]
      if (digit !== '0') {
        adding = false
        break
      }
      if (i === 0) {
        count++
        adding = true
        continue
      }
      if (adding) {
        count++
      }
    }
    if (count < 3) {
      return 0
    }
    return count
  }

  const removeTrailingZeros = (int: string) => {
    if (int === '0') return int
    let lastNonZeroIndex = int.length - 1
    while (lastNonZeroIndex > 0 && int[lastNonZeroIndex] === '0') {
      lastNonZeroIndex--
    }
    return int.slice(0, lastNonZeroIndex + 1)
  }

  $: decimalNumber = formatUnits(x, decimals)
  $: [int, decimal = ''] = decimalNumber.split('.')
  $: intSets = Math.ceil(int.length / setSize)
  $: intDelimited = addDelimiter(BigInt(int), delimiter)
  $: manditorySets = intSets > 0 && int !== '0' ? intSets : 0
  $: unused = unusedSets(decimal)
  $: decimalCount = manditorySets >= maxDelimiterSets ? 0 : (maxDelimiterSets - manditorySets) * setSize
  $: decimalDigits = Math.min(decimalCount, maxDecimalDigits)
  $: decimalStart = unused ? unused * setSize : 0
  $: allDecimalDigits = decimal.slice(0, decimalStart + decimalDigits)
  $: shortenCount = shortenUnusedZeros(allDecimalDigits)
  $: decimalDigitsNoEndZeros = removeTrailingZeros(allDecimalDigits)
  $: value = joinNumber(intDelimited, decimalDigitsNoEndZeros)
  $: showingSub = truncateZeros && !!shortenCount
  $: showingSubDecimals = decimalDigitsNoEndZeros.slice(shortenCount)
</script>

<slot {value}>
  {#if !showingSub}{value}
  {:else}{intDelimited}.0<sub>{shortenCount}</sub>{showingSubDecimals}
  {/if}
</slot>
