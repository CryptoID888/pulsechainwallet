<script lang="ts">
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
  import { SlideToggle, CodeBlock, RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import type { PrepConfig, ViemRawTransaction } from '$lib/transactions'
  import { chain, currentBlock } from '$lib/chain-state'
  import { chainById } from '$lib/visual-chain'
  import NetworkImage from '../NetworkImage.svelte'
  import Icon from '@iconify/svelte'
  import AccountSummary from '$lib/components/account/Summary.svelte'
  import { type FeeValuesType, parseUnits, formatUnits, type Hex, type SendTransactionParameters } from 'viem'
  import { config } from '$lib/config'
  import { currentAccount as account, nonces } from '$lib/wallets'
  import { wallet } from '$lib/api'
  import Number from '../Number.svelte'
  import { delimiter, delimiterRender } from '$lib/modifiers/delimiter'
  import { addDecimalDelimiter, sanitize, sanitizeDecimal } from '$lib/number'
  import { createEventDispatcher, onMount } from 'svelte'
  import PriceFetch from '../PriceFetch.svelte'
  import { nativeTokenOn } from '$lib/tokens'
  import Portal from 'svelte-portal'
  import { stickyFilledOnMount } from '$lib/ui'
  import * as jsonreplacer from '$lib/serializers/json'
  import type { RawTransaction } from '$lib/transactions'
  import Loader from '../Loader.svelte'
  import { emptyHex, type ChainIds, feeTypes } from '$common/config'

  const dispatch = createEventDispatcher()

  type PresetSpeed = 0 | 1 | 2
  type FeeSpeed = PresetSpeed | 3

  const k10 = 10_000n
  const lowBoundBaseFee = 7n
  const lowBoundPriorityFee = 1n
  const oneEther = 10n ** 18n
  const priorityMultipliers = [1n, 2n, 4n] as const
  const speedLabels = ['Normal', 'Fast', 'Instant', 'Custom'] as const
  const max = (a: bigint, b: bigint) => {
    return a > b ? a : b
  }

  const feeSpeedCalc = (base: bigint, priority: bigint, prioMult: bigint) => {
    return base + priority * prioMult
  }
  const activeIs = (name: string) => (document.activeElement as HTMLInputElement)?.id === name
  const recheckNumber = (name: string, num: string) => {
    let number = num
    if (!activeIs(name)) {
      number = addDecimalDelimiter(number)
    }
    return number
  }
  const reflowGasLimitInput = () => {
    const name = 'gas-limit'
    gasLimitInput = recheckNumber(name, `${estimatedGas || gasLimitExternal}`)
  }
  const reflowMaxBaseFeeInput = () => {
    const name = 'max-base-fee'
    if (!feeInputDisabled) return
    maxBaseFeeInput = recheckNumber(name, formatUnits(max(maxBaseFeeExternal || calcMaxBaseFee(), lowBoundBaseFee), 9))
  }
  const calcMaxBaseFee = () =>
    feeInputDisabled
      ? feeSpeedCalc(maxBaseFeePerGas, maxPriorityFeePerGas, priorityMultipliers[feeSpeed as PresetSpeed])
      : maxBaseFeePerGas
  const reflowMaxPriorityFeeInput = () => {
    const name = 'max-priority-fee'
    if (!feeInputDisabled) return
    maxPriorityFeeInput = recheckNumber(
      name,
      formatUnits(
        max(
          maxPriorityFeeExternal || maxPriorityFeePerGas * priorityMultipliers[feeSpeed as PresetSpeed],
          lowBoundPriorityFee,
        ),
        9,
      ),
    )
  }
  const handleFeeSpeedChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    feeSpeed = +target.value as typeof feeSpeed
  }
  const handleFeeTypeChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    feeType = target.checked ? feeTypes.EIP1559 : feeTypes.LEGACY
  }

  const handleRawDataPanelToggle = (e: CustomEvent) => {
    rawDataPanelOpen = e.detail.open
  }

  const handleConfirm = () => {
    if (!transactionJSON) return
    const tx: RawTransaction = transactionJSON
    const viemTx: ViemRawTransaction = {
      ...tx,
      type: tx.type === 1n ? feeTypes.LEGACY : feeTypes.EIP1559,
    }
    dispatch('confirm', viemTx)
  }

  let feeType: FeeValuesType = $config.defaultTransactionFeeType
  let baseFeeValidityRange = $config.baseFeeValidityRange
  let maxBaseFeePerGas = 0n
  let maxPriorityFeePerGas = 0n
  let gasSpeedMultiplierIndex = 0
  let gasLimitInput = ''
  let gasLimitExternal: bigint | null = null
  let maxBaseFeeInput = ''
  let maxBaseFeeExternal: bigint | null = null
  let maxPriorityFeeInput = ''
  let maxPriorityFeeExternal: bigint | null = null
  let usePendingNonce = true

  export let prep!: PrepConfig
  $: if (prep.gas) {
    gasLimitExternal = BigInt(prep.gas)
  }
  /**
   * requests that this module check the gas consumption of a call.
   * also implicitly check the success or failure status
   */
  export let estimateGas = false
  export let simulate = false
  export let feeSpeed: FeeSpeed = 0
  export { gasLimitExternal as gasLimit }
  export { maxBaseFeeExternal as maxBaseFee }
  export { maxPriorityFeeExternal as maxPriorityFee }
  let estimatedGas: bigint | null = null
  let saveDefaults = false
  let nonceInput: string | null = null
  let price = 0n
  let rawDataPanelOpen = false
  let showNumbers = $config.numbersOverHex

  $: chainId = $chain?.id as ChainIds
  $: visualChain = chainById.get(chainId)!
  $: feeTypeChecked = feeType === feeTypes.EIP1559
  $: baseFeeNumerator = 1_125n ** BigInt(baseFeeValidityRange)
  $: baseFeeDenominator = (10n ** 3n) ** BigInt(baseFeeValidityRange)
  $: feeInputDisabled = feeSpeed !== 3
  $: if (feeSpeed || estimatedGas || gasLimitExternal) {
    reflowGasLimitInput()
  }
  $: if (feeSpeed || maxPriorityFeeExternal || maxPriorityFeePerGas) {
    reflowMaxPriorityFeeInput()
  }
  $: if (feeSpeed || maxBaseFeeExternal || maxBaseFeePerGas) {
    reflowMaxBaseFeeInput()
  }
  const runGasEstimation = () => {
    let cancelled = false
    wallet
      .estimateGas(chainId, {
        account: prep.from.address as Hex,
        to: prep.to as Hex,
        value: prep.value,
        data: prep.data as Hex,
      } as SendTransactionParameters)
      .then((estimate) => {
        if (cancelled) return
        estimatedGas = BigInt(estimate)
      })
    return () => {
      cancelled = true
    }
  }
  let cancelGasEstimation = () => {}
  $: if (estimateGas) {
    cancelGasEstimation()
    cancelGasEstimation = runGasEstimation()
  } else {
    cancelGasEstimation()
  }
  const runSimulation = () => {
    // let cancelled = false
    // $currentPublicClient?.debug()
    return () => {
      // cancelled = true
    }
  }
  let cancelSimulation = () => {}
  $: if (simulate) {
    cancelSimulation()
    cancelSimulation = runSimulation()
  } else {
    cancelSimulation()
  }
  onMount(() => {
    reflowGasLimitInput()
    reflowMaxPriorityFeeInput()
    reflowMaxBaseFeeInput()
  })
  // we can do this without parseUnit because gas limit is an int
  $: gasLimit = BigInt(sanitize(gasLimitInput))
  $: block = $currentBlock
  const lowerBoundPriorityFee = 1n
  $: if (block) {
    const blockBaseFee = block.baseFeePerGas as bigint
    maxBaseFeePerGas = (baseFeeNumerator * blockBaseFee) / baseFeeDenominator
    const computedMaxPriorityFeePerGas =
      (blockBaseFee * (k10 + BigInt($config.defaultPriorityFeeAdditive))) / k10 - blockBaseFee
    maxPriorityFeePerGas =
      computedMaxPriorityFeePerGas < lowerBoundPriorityFee ? lowerBoundPriorityFee : computedMaxPriorityFeePerGas
  }
  $: minNonce = BigInt($nonces?.latest || 0n)
  $: nonce =
    (nonceInput === null || nonceInput === '') && $nonces
      ? usePendingNonce
        ? $nonces.pending
        : $nonces.latest
      : !nonceInput
        ? window.Number(nonceInput as string)
        : Math.max(window.Number(nonceInput), window.Number(minNonce))
  $: finalMaxBaseFeePerGas = max(parseUnits(sanitizeDecimal(maxBaseFeeInput), 9), lowBoundBaseFee)
  $: finalMaxPriorityFeePerGas = max(parseUnits(sanitizeDecimal(maxPriorityFeeInput), 9), lowBoundPriorityFee)
  $: gasSettings =
    feeType === feeTypes.EIP1559
      ? {
          type: 2n,
          maxBaseFeePerGas: finalMaxBaseFeePerGas,
          maxPriorityFeePerGas: finalMaxPriorityFeePerGas,
        }
      : {
          type: 1n,
          gasPrice: 0n,
        }

  $: paySettings = {
    gas: gasLimit,
    nonce,
    ...gasSettings,
  }
  $: transactionJSON = {
    from: prep.from.address,
    to: prep.to,
    value: prep.value,
    data: prep.data,
    ...paySettings,
  } as RawTransaction
  $: rawData = JSON.stringify(transactionJSON, showNumbers ? jsonreplacer.bigintToString : jsonreplacer.bigintToHex, 2)
  $: nativeToken = nativeTokenOn(visualChain.id)
  $: costNative =
    gasLimit *
    (feeInputDisabled
      ? feeSpeedCalc(maxBaseFeePerGas, maxPriorityFeePerGas, priorityMultipliers[feeSpeed as PresetSpeed])
      : maxBaseFeePerGas + maxPriorityFeePerGas)
  $: costFiat = (costNative * price) / oneEther
  $: disabled = nonce === null || !$nonces || !transactionJSON

  onMount(stickyFilledOnMount)
</script>

<div class="flex flex-col">
  <div class="mb-2 flex w-full flex-row px-4 py-2">
    <span class="flex flex-grow">Network</span>
    <NetworkImage size={24} chain={visualChain} />
    <span class="ml-2 flex">{$chain?.name}</span>
  </div>
  {#if $account}
    <AccountSummary account={$account} />
  {/if}
  <div class="my-2 flex w-full">
    <Accordion spacing="space-y-2">
      <AccordionItem on:toggle={handleRawDataPanelToggle}>
        <svelte:fragment slot="lead">
          <span class="flex size-6 items-center justify-center">
            <Icon icon="bx:data" height={24} width={24} />
          </span>
        </svelte:fragment>
        <svelte:fragment slot="summary">
          <div class="flex flex-row items-center justify-between">
            <span class="flex flex-grow-[2] font-bold">Raw Data</span>
            {#if rawDataPanelOpen}
              <button class="contents" on:click|stopPropagation>
                <label for="show-numbers" class="contents">
                  <span class="px-2 font-mono">{showNumbers ? '#' : emptyHex}</span>
                  <SlideToggle
                    name="show-numbers"
                    id="show-numbers"
                    background="bg-primary-300"
                    active="bg-primary-500"
                    bind:checked={showNumbers}
                    size="sm"
                  />
                </label>
              </button>
            {/if}
          </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
          <CodeBlock language="json" code={rawData}></CodeBlock>
        </svelte:fragment>
      </AccordionItem>
      <AccordionItem>
        <svelte:fragment slot="lead">
          <span class="flex size-6 items-center justify-center">
            <Icon icon="fa:tint" height={16} width={16} />
          </span>
        </svelte:fragment>
        <svelte:fragment slot="summary">
          <div class="flex flex-row items-center justify-between">
            <span class="flex flex-row items-baseline">
              <span class="min-w-40">
                <span class="font-bold">{speedLabels[feeSpeed]}</span>:&nbsp;<span class="text-sm text-neutral-500"
                  >@<Number truncateZeros x={finalMaxBaseFeePerGas} decimals={9} maxDelimiterSets={2} /></span
                >&nbsp;
              </span>
              <Number truncateZeros x={costNative} maxDelimiterSets={2} />&nbsp;{nativeToken.metadata
                .symbol}&nbsp;-&nbsp;$<Number truncateZeros x={costFiat} maxDelimiterSets={2} />
              <PriceFetch bind:price token={nativeToken} />
            </span>
            <div class="flex flex-row items-center">
              <button type="button" class="flex flex-row items-center" on:click|stopPropagation>
                <label for="fee-type" class="contents">
                  <SlideToggle
                    id="fee-type"
                    name="feeType"
                    size="sm"
                    disabled
                    checked={feeTypeChecked}
                    on:change={handleFeeTypeChange}
                    background="bg-primary-300"
                    active="bg-primary-500"
                  />
                </label>
              </button>
            </div>
          </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
          <div class="flex flex-row items-start">
            <div class="flex flex-col">
              <div class="flex flex-row items-center">
                <button type="button" class="contents" on:click|stopPropagation>
                  <label for="save-defaults" class="mb-2 flex w-full flex-row items-center justify-between">
                    <span class="mr-2">Save as Defaults</span>
                    <SlideToggle
                      background="bg-primary-300"
                      active="bg-primary-500"
                      size="sm"
                      id="save-defaults"
                      name="save-defaults"
                      disabled
                      bind:checked={saveDefaults}
                    />
                  </label>
                </button>
              </div>
              <RadioGroup flexDirection="flex-col" padding="p-0" border="border-0">
                <RadioItem
                  on:change={handleFeeSpeedChange}
                  padding="px-2 py-1"
                  bind:group={gasSpeedMultiplierIndex}
                  name="gasSpeedMultiplier"
                  value={0}
                >
                  <div class="flex flex-row items-center justify-between gap-2">
                    <span class="min-w-16 text-left font-bold">{speedLabels[0]}</span>
                    <span class="min-w-28 text-right text-sm">
                      <Number
                        truncateZeros
                        decimals={9}
                        x={feeSpeedCalc(maxBaseFeePerGas, maxPriorityFeePerGas, priorityMultipliers[0])}
                        maxDelimiterSets={2}
                      />
                      <span>{visualChain.gasUnit}</span>
                    </span>
                  </div>
                </RadioItem>
                <RadioItem
                  on:change={handleFeeSpeedChange}
                  padding="px-2 py-1"
                  bind:group={gasSpeedMultiplierIndex}
                  name="gasSpeedMultiplier"
                  value={1}
                >
                  <div class="flex flex-row items-center justify-between gap-2">
                    <span class="min-w-16 text-left font-bold">{speedLabels[1]}</span>
                    <span class="min-w-28 text-right text-sm">
                      <Number
                        truncateZeros
                        decimals={9}
                        x={feeSpeedCalc(maxBaseFeePerGas, maxPriorityFeePerGas, priorityMultipliers[1])}
                        maxDelimiterSets={2}
                      />
                      <span>{visualChain.gasUnit}</span>
                    </span>
                  </div>
                </RadioItem>
                <RadioItem
                  on:change={handleFeeSpeedChange}
                  padding="px-2 py-1"
                  bind:group={gasSpeedMultiplierIndex}
                  name="gasSpeedMultiplier"
                  value={2}
                >
                  <div class="flex flex-row items-center justify-between gap-2">
                    <span class="min-w-16 text-left font-bold">{speedLabels[2]}</span>
                    <span class="min-w-28 text-right text-sm">
                      <Number
                        truncateZeros
                        decimals={9}
                        maxDelimiterSets={2}
                        x={feeSpeedCalc(maxBaseFeePerGas, maxPriorityFeePerGas, priorityMultipliers[2])}
                      />
                      <span>{visualChain.gasUnit}</span>
                    </span>
                  </div>
                </RadioItem>
                <RadioItem
                  on:change={handleFeeSpeedChange}
                  padding="px-2 py-1"
                  bind:group={gasSpeedMultiplierIndex}
                  name="gasSpeedMultiplier"
                  value={3}
                >
                  <div class="flex flex-row items-center justify-between gap-2">
                    <span class="min-w-16 text-left font-bold">{speedLabels[3]}</span>
                  </div>
                </RadioItem>
              </RadioGroup>
            </div>
            <div class="grid w-full grid-cols-2 flex-col gap-4 py-0 pl-4">
              <label for="max-base-fee" class="label text-left">
                <span class="text-left text-sm">Max Base Fee</span>
                <input
                  type="text"
                  class="input"
                  id="max-base-fee"
                  disabled={feeInputDisabled}
                  bind:value={maxBaseFeeInput}
                  use:delimiter={delimiterRender(() => ({ decimals: 9, min: 0n }))}
                />
              </label>
              <label for="max-priority-fee" class="label text-left">
                <span class="text-left text-sm">Max Priority Fee</span>
                <input
                  type="text"
                  class="input"
                  id="max-priority-fee"
                  disabled={feeInputDisabled}
                  bind:value={maxPriorityFeeInput}
                  use:delimiter={delimiterRender(() => ({ decimals: 9, min: 1n }))}
                />
              </label>
              <label for="gas-limit" class="label text-left">
                <span class="text-left text-sm">Limit</span>
                <input
                  type="text"
                  class="input"
                  id="gas-limit"
                  bind:value={gasLimitInput}
                  use:delimiter={delimiterRender(() => ({ decimals: 0, min: 21_000n }))}
                />
              </label>
            </div>
          </div>
        </svelte:fragment>
      </AccordionItem>
      <AccordionItem>
        <svelte:fragment slot="lead">
          <span class="flex size-6 items-center justify-center">
            <Icon icon="mdi:pound" height={24} width={24} />
          </span>
        </svelte:fragment>
        <svelte:fragment slot="summary">
          <div class="flex flex-row items-center justify-between">
            <span class="font-bold">Nonce</span>
            <span>
              {#if $nonces}
                {nonce}
              {:else}
                <Loader size={16} />
              {/if}
            </span>
          </div>
        </svelte:fragment>
        <svelte:fragment slot="content">
          <div class="flex flex-row items-center">
            <button type="button" class="contents" on:click|stopPropagation>
              <label for="use-pending" class="flex h-10 flex-row items-center text-left">
                <SlideToggle
                  name="use-pending"
                  id="use-pending"
                  background="bg-primary-300"
                  active="bg-primary-500"
                  size="sm"
                  bind:checked={usePendingNonce}
                />
                <span class="min-w-24 pl-2 capitalize">{usePendingNonce ? 'pending' : 'latest'}</span>
              </label>
            </button>
            <input
              type="text"
              class="input text-right"
              id="nonce"
              placeholder={`${nonce}`}
              bind:value={nonceInput}
              use:delimiter={delimiterRender(() => ({ decimals: 0, min: minNonce, max: 2n ** 32n - 1n }))}
            />
          </div>
        </svelte:fragment>
      </AccordionItem>
    </Accordion>
  </div>
</div>
<Portal target="#sticky-portal">
  <div class="flex flex-row items-center gap-2 bg-primary-50 px-4 py-2 shadow-inner">
    <button {disabled} type="button" class="variant-filled-primary btn w-full" on:click={handleConfirm}>Confirm</button>
    <button
      type="button"
      class="variant-ghost-primary btn"
      on:click={() => {
        dispatch('back')
      }}>Cancel</button
    >
  </div>
</Portal>
