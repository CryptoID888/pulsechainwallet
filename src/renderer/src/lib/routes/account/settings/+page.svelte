<script lang="ts">
  import Label from '$lib/components/Label.svelte'
  import { settings } from '$lib/settings'
  import { RangeSlider, SlideToggle } from '@skeletonlabs/skeleton'
  import { defaultAddress, truncatedAddress } from '$lib/address'
  import { formatUnits, parseUnits } from 'viem'
  import { delimiter } from '$lib/modifiers/delimiter'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
  import StepIncrementor from '$lib/components/StepIncrementor.svelte'
  import { emptyHex } from '$common/config'

  let digitGroupSeparator = $settings.digitGroupSeparator
  let decimalSeparator = $settings.decimalSeparator
  let maxDelimiterSets = $settings.maxDelimiterSets
  let addressTruncation = $settings.addressTruncation
  let defaultTransactionTypeIsEIP1559 = $settings.defaultTransactionFeeType === 'eip1559'
  let defaultGasLimitMultiplierInput = formatUnits(BigInt($settings.defaultGasLimitMultiplier), 4)
  let autoReplaceUnderpriced = $settings.autoReplaceUnderpriced
  let numbersOverHex = $settings.numbersOverHex
  let baseFeeValidityRange = $settings.baseFeeValidityRange
  let defaultPriorityFeeAdditiveInput = formatUnits(BigInt($settings.defaultPriorityFeeAdditive), 2)
  let defaultPriorityFeeRetryAdditiveInput = formatUnits(BigInt($settings.defaultPriorityFeeRetryAdditive), 2)
  let showTestnets = !!$settings.showTestnets
  $: defaultGasLimitMultiplier = defaultGasLimitMultiplierInput
    ? parseUnits(defaultGasLimitMultiplierInput, 4)
    : BigInt($settings.defaultGasLimitMultiplier)
  $: defaultPriorityFeeAdditive = defaultPriorityFeeAdditiveInput
    ? parseUnits(defaultPriorityFeeAdditiveInput, 2)
    : BigInt($settings.defaultPriorityFeeAdditive)
  $: defaultPriorityFeeRetryAdditive = defaultPriorityFeeRetryAdditiveInput
    ? parseUnits(defaultPriorityFeeRetryAdditiveInput, 2)
    : BigInt($settings.defaultPriorityFeeRetryAdditive)

  $: settings.update(($settings) => {
    return {
      ...$settings,
      addressTruncation,
      digitGroupSeparator,
      decimalSeparator,
      maxDelimiterSets,
      defaultTransactionFeeType: defaultTransactionTypeIsEIP1559 ? 'eip1559' : 'legacy',
      defaultGasLimitMultiplier: Number(defaultGasLimitMultiplier),
      autoReplaceUnderpriced,
      numbersOverHex,
      baseFeeValidityRange,
      defaultPriorityFeeAdditive: Number(defaultPriorityFeeAdditive),
      defaultPriorityFeeRetryAdditive: Number(defaultPriorityFeeRetryAdditive),
      showTestnets,
    }
  })
  const upperBoundMaxDigitGroupSets = 12
  const handleBaseFeeValidityRangeChange = (e: CustomEvent<bigint>) => {
    baseFeeValidityRange += window.Number(e.detail)
  }
</script>

<Crumb {...crumbs.settings} />

<div class="p-4">
  <ul class="flex w-full flex-col gap-4">
    <li class="flex w-full">
      <h3 class="h3">Presentation</h3>
    </li>
    <li class="flex w-full flex-col">
      <div class="grid grid-cols-2 gap-x-4">
        <Label text="Digit Group Separator" />
        <Label text="Decimal Separator" />
        <input type="text" class="input variant-ghost-primary text-right" bind:value={digitGroupSeparator} />
        <input type="text" class="input variant-ghost-primary text-right" bind:value={decimalSeparator} />
        <span class="text-sm"
          >Example: <span class="font-mono"
            >123{digitGroupSeparator}456{digitGroupSeparator}789{decimalSeparator}0001</span
          ></span>
      </div>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Max Decimal Set">
        <span class="font-mono text-sm">{maxDelimiterSets}/{upperBoundMaxDigitGroupSets}</span>
      </Label>
      <RangeSlider
        name="max-decimal-sets"
        bind:value={maxDelimiterSets}
        min={3}
        max={upperBoundMaxDigitGroupSets}
        step={1}
        ticked></RangeSlider>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Truncate Address">
        <span class="font-mono text-sm">{addressTruncation}</span>
      </Label>
      <RangeSlider name="address-truncation" bind:value={addressTruncation} min={4} max={20} step={1}></RangeSlider>
      <span class="font-mono text-sm">{truncatedAddress(defaultAddress, addressTruncation)}</span>
    </li>
    <!-- gas settings -->
    <li class="flex w-full">
      <h3 class="h3">Gas</h3>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Gas Limit Multiplier">
        <span class="font-mono">{formatUnits(BigInt(defaultGasLimitMultiplier), 4)} * estimated_gas = gas_limit</span>
      </Label>
      <!-- step="0.0001" -->
      <input
        class="input text-right"
        type="text"
        bind:value={defaultGasLimitMultiplierInput}
        use:delimiter={{ decimals: 4, min: 10_000n, delimiter: false }} />
      <span class="text-sm italic">* for non native transfer transactions only</span>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Prefer Numbers or Hexadecimal"
        ><span class="font-mono">{numbersOverHex ? '' : emptyHex}{(123456789).toString(numbersOverHex ? 10 : 16)}</span
        ></Label>
      <div class="flex flex-row gap-2">
        <span class="font-mono">0x</span>
        <SlideToggle
          name="numbers-over-hex"
          bind:checked={numbersOverHex}
          size="sm"
          background="bg-primary-300"
          active="bg-primary-500" />
        <span class="font-mono">#</span>
      </div>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Base Fee Validity Range" />
      <div class="variant-soft-rec input-group input-group-divider flex grid-cols-[auto_1fr_auto] items-center">
        <StepIncrementor decrementDisabled={baseFeeValidityRange <= 1} on:change={handleBaseFeeValidityRangeChange} />
        <input
          type="text"
          use:delimiter={{ decimals: 0, min: 1n }}
          class="flex flex-grow text-right"
          min="1"
          bind:value={baseFeeValidityRange} />
      </div>
      <span class="text-sm italic">Defaults to a base fee that will be valid for at least this many blocks</span>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Default Transaction Type" />
      <label for="default-transaction-type" class="flex flex-row gap-2">
        <span>Legacy</span>
        <SlideToggle
          size="sm"
          id="default-transaction-type"
          name="default-transaction-type"
          background="bg-primary-300"
          active="bg-primary-500"
          disabled
          bind:checked={defaultTransactionTypeIsEIP1559} />
        <span>EIP1559</span>
      </label>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Priority Fee Additive">
        <span class="font-mono">base * {defaultPriorityFeeAdditiveInput}% = priority</span>
      </Label>
      <input
        type="text"
        name="default-priority-fee-additive"
        id="default-priority-fee-additive"
        class="input text-right"
        bind:value={defaultPriorityFeeAdditiveInput}
        use:delimiter={{ decimals: 2, delimiter: false }} />
      <span class="text-sm italic">Generate a default priority fee that is x% of the latest block's base fee.</span>
    </li>
    <!-- replace / reattempt transaction -->
    <li class="flex w-full">
      <h3 class="h3">Retries</h3>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Priority Fee Retry Additive">
        <span class="font-mono">previous_priority += {defaultPriorityFeeRetryAdditiveInput}% = priority</span>
      </Label>
      <input
        type="text"
        name="default-priority-fee-retry-additive"
        id="default-priority-fee-retry-additive"
        class="input text-right"
        bind:value={defaultPriorityFeeRetryAdditiveInput}
        use:delimiter={{ decimals: 2, delimiter: false }} />
      <span class="text-sm italic"
        >Generate a default priority fee that is x% of the previous transaction's priority fee.</span>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Auto Replace Underpriced" />
      <SlideToggle
        size="sm"
        name="auto-replace-underpriced"
        background="bg-primary-300"
        active="bg-primary-500"
        disabled
        bind:checked={autoReplaceUnderpriced} />
      <span class="text-sm italic">Replaces a transaction when the base fee moves too quickly against you.</span>
    </li>
    <!-- dev settings -->
    <li class="flex w-full">
      <h3 class="h3">Dev</h3>
    </li>
    <li class="flex w-full flex-col">
      <Label text="Show testnet" />
      <SlideToggle
        size="sm"
        name="show-testnet"
        background="bg-primary-300"
        active="bg-primary-500"
        bind:checked={showTestnets} />
    </li>
  </ul>
</div>
