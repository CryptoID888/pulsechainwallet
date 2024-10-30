<script lang="ts">
  import _ from 'lodash'
  import ChipList from '$lib/components/ChipList.svelte'
  import { encodeFunctionData, formatEther, multicall3Abi, type Hex } from 'viem'
  import { verifyWithdrawal } from '$common/pools'
  import { link } from 'svelte-spa-router'
  import { msgboardPoolContents } from '$lib/msgboard'
  import { chain } from '$lib/chain-state'
  import { createEventDispatcher } from 'svelte'
  import { PrivacyPoolAbi } from '$common/abis/PrivacyPool'
  import { currentAccount } from '$lib/wallets'
  import type { PrivacyPool } from '$common/indexer/gql/graphql'

  const dispatch = createEventDispatcher()

  $: messages = $msgboardPoolContents.messages
  $: poolById = _.keyBy($msgboardPoolContents.pools, 'id')
  $: sortedPoolContents = _.sortBy(messages, [
    // highest fee first
    (a) => {
      const {
        args: [verifiable],
      } = verifyWithdrawal.decode(a.data)
      return verifiable.fee
    },
    // order by block number
    (a) => Number(a.blockNumber),
    // then by hash
    (a) => a.hash,
  ])
  $: mapping = new Map(
    sortedPoolContents.map((message) => {
      const {
        args: [verifiable],
      } = verifyWithdrawal.decode(message.data)
      const hashPrefix = message.hash.slice(0, 12)
      const unit = $chain.nativeCurrency.symbol
      const key = `${hashPrefix}/${formatEther(verifiable.fee)}${unit}`
      return [key, message] as const
    }),
  )
  $: chips = new Set(mapping.keys())
  let selected = new Set<string>()
  const navigateToAssist = (e: CustomEvent<string>) => {
    const key = e.detail
    if (!selected.has(key)) selected.add(key)
    else selected.delete(key)
    selected = selected
  }
  const selectMax = () => {
    selected = new Set([...chips.values()].slice(0, 10))
    dispatch('change')
  }
  const toArgs = (poolById: _.Dictionary<PrivacyPool>) =>
    [...selected.values()].map((key) => {
      const message = mapping.get(key)!
      const {
        args: [verifiable],
      } = verifyWithdrawal.decode(message.data)
      const contractCalldata = encodeFunctionData({
        abi: PrivacyPoolAbi,
        functionName: 'withdraw',
        args: [
          {
            feeReceiver: $currentAccount.address,
            proof: verifiable,
          },
        ],
      })
      return {
        target: poolById[message.category].address as Hex,
        allowFailure: true,
        callData: contractCalldata,
      }
      // return [verifiable.address, contractCalldata]
    })
  $: multicallAddress = $chain.contracts.multicall3.address
  $: calldata =
    selected.size > 0
      ? encodeFunctionData({
          abi: multicall3Abi,
          functionName: 'aggregate3',
          args: [toArgs(poolById)],
        })
      : null
  $: if (selected) {
    dispatch('change')
  }
  // 3 million gas per proof
  // should be sufficient to stop at 20m given that (nearly)
  // the same storage will be accessed for each proof
  $: gasLimit = Math.min(20_000_000, 3_000_000 * selected.size)
</script>

<div class="flex w-full flex-col px-4 gap-2">
  <div class="flex w-full justify-between items-center">
    <h3 class="h3 flex justify-between items-center">Assist</h3>
    <a use:link class="anchor" href="/account/shield/work">Work &rightarrow;</a>
  </div>
  <div class="w-full">
    <button type="button" class="btn variant-ghost-primary btn-sm" on:click={selectMax}>Max</button>
  </div>
  <ChipList {chips} {selected} on:toggle={navigateToAssist} />
</div>

<div class="absolute hidden">
  <input type="hidden" id="to-address" name="to-address" value={multicallAddress} />
  <input type="hidden" id="value" name="value" value={0n} />
  <input type="hidden" id="gas" name="gas" value={gasLimit} />
  <input type="hidden" id="data" name="data" on:change value={calldata} />
</div>
