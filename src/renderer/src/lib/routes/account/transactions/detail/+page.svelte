<script lang="ts">
  import Number from '$lib/components/Number.svelte'
  import NetworkImage from '$lib/components/NetworkImage.svelte'
  import Address from '$lib/components/Address.svelte'
  import CopyText from '$lib/components/CopyText.svelte'
  import Icon from '@iconify/svelte'
  import Crumb from '$lib/components/Crumb.svelte'

  import { pulsechainV4 } from 'viem/chains'

  export let params: { hash: string; chainId: number }
  import { chainIdToChain } from '$lib/chain-state'
  import { chainById } from '$lib/visual-chain'
  import { crumbs } from '$lib/navigation'
  import { state } from '$lib/api'
  import type { Hex } from 'viem'
  import type { TransactionData } from '$common/types'

  // $: console.log('params=%o', params)
  // let data: TransactionData | null = null
  // $: transaction = $transactions.find((tx) => tx.hash === params.hash)
  let chaindata: Partial<TransactionData> | null = null

  $: chainId = +params.chainId
  $: chain = chainIdToChain.get(chainId)!
  $: visualChain = chainById.get(chainId)!
  $: {
    state.transactionData(chainId, params.hash as Hex).then((data) => {
      chaindata = data
    })
  }
  $: href = chain
    ? `${chain.blockExplorers.default.url}${chainId === pulsechainV4.id ? '/#' : ''}/tx/${chaindata?.transaction?.hash}`
    : ''
  $: status = chaindata?.receipt?.status || 'pending'
</script>

<Crumb {...crumbs.transactions} />
<Crumb {...crumbs.transactionDetails(chaindata?.transaction?.hash || '0x')} />
{#if chaindata}
  <div class="flex px-4 flex-col gap-2">
    <div class="flex flex-row">
      <div class="flex flex-col justify-between w-full gap-2">
        <NetworkImage size={32} chain={visualChain} />
        <div>
          <span class="btn btn-sm" class:variant-soft-success={status === 'success'}>{status}</span>
        </div>
      </div>
      <div class="flex flex-col justify-end w-fit gap-2">
        <a class="text-right anchor" {href} target="_blank">View&nbsp;on&nbsp;Block&nbsp;Explorer</a>
        <div class="flex justify-end">
          <label for="copy-hash" class="flex flex-row"
            ><CopyText name="copy-hash" text={chaindata?.transaction?.hash || ''} size={16} />Copy Hash
          </label>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-between">
      <div class="flex flex-row w-full">
        <div class="flex flex-col w-full">
          <span class="font-bold">From</span>
          <span class="font-mono flex flex-row">
            <label for="copy-from" class="flex flex-row border-2 rounded-full px-2 py-1">
              <Address address={chaindata?.transaction?.from || ''} />
              <CopyText name="copy-from" text={chaindata?.transaction?.from || ''} size={16} />
            </label>
          </span>
        </div>
        <div class="mt-2 top-2 w-1 bg-gray-200 relative">
          <div
            class="size-8 bg-gray-600 rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 items-center text-white justify-center text-center flex">
            <Icon icon="mdi:arrow-right" height={24} width={24} />
          </div>
        </div>
        <div class="flex flex-col w-full items-end">
          <span class="font-bold">To</span>
          <span class="font-mono flex flex-row-reverse">
            <label for="copy-to" class="flex flex-row border-2 rounded-full px-2 py-1">
              <Address address={chaindata?.transaction?.to || ''} />
              <CopyText name="copy-to" text={chaindata?.transaction?.to || ''} size={16} />
            </label>
          </span>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Amount</span>
      <span class="font-mono"
        ><Number decimals={18} x={chaindata?.transaction?.value || 0n} /> {chain?.nativeCurrency?.symbol}</span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Nonce</span>
      <span class="font-mono">{chaindata?.transaction?.nonce || ''}</span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Gas Limit</span>
      <span class="font-mono"><Number decimals={0} x={chaindata?.transaction?.gas || 0n} /></span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Gas Used</span>
      <span class="font-mono"><Number decimals={0} x={chaindata?.receipt?.gasUsed || 0n} /></span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Base Fee (<span class="uppercase">{visualChain?.gasUnit}</span>)</span>
      <span class="font-mono"><Number decimals={9} x={chaindata?.block?.baseFeePerGas || 0n} /></span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Max Base Fee (<span class="uppercase">{visualChain?.gasUnit}</span>)</span>
      <span class="font-mono"><Number decimals={9} x={chaindata?.transaction?.maxFeePerGas || 0n} /></span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Max Priority Fee (<span class="uppercase">{visualChain?.gasUnit}</span>)</span>
      <span class="font-mono"><Number decimals={9} x={chaindata?.transaction?.maxPriorityFeePerGas || 0n} /></span>
    </div>
    <div class="flex w-full justify-between">
      <span class="font-bold">Total Fee (<span class="uppercase">{visualChain?.gasUnit}</span>)</span>
      <span class="font-mono"><Number decimals={9} x={chaindata?.receipt?.effectiveGasPrice || 0n} /></span>
    </div>
  </div>
{/if}
