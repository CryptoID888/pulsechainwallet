<script lang="ts">
  import { currentBlock } from '$lib/chain-state'
  import Icon from '@iconify/svelte'
  import Number from './Number.svelte'
  $: blockNumber = $currentBlock?.number || 0n
  $: baseFeePerGas = $currentBlock?.baseFeePerGas || 0n
  $: disabled = blockNumber === 0n
  $: timestamp = window.Number($currentBlock?.timestamp || 0n) * 1_000
  const showPopover = () => {}
</script>

<div class="flex flex-row items-center">
  <button type="button" class="contents" {disabled} on:click={showPopover}>
    <Icon icon="hugeicons:blockchain-02" class="mr-1" />
    <span class="flex" title={timestamp ? new Date(timestamp).toISOString() : ''}>
      {#if blockNumber}
        <Number x={blockNumber} decimals={0} />
      {:else}
        xxx,xxx,xxx
      {/if}
    </span>
    <span
      class="mx-2 flex size-3.5 flex-col items-center justify-center whitespace-pre rounded-full border-2 border-white text-sm"
      class:bg-green-400={!disabled}
      class:bg-error-400={disabled}
    >
    </span>
    {#if blockNumber}
      <span class="flex flex-row items-center">
        <Number decimals={9} x={baseFeePerGas} maxDelimiterSets={2} truncateZeros />&nbsp;<Icon
          icon="fa:tint"
          height={14}
          width={14}
        />
      </span>
    {/if}
  </button>
</div>
