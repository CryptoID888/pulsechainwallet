<script lang="ts">
  import { isAddress, getAddress, zeroAddress } from 'viem'
  import _ from 'lodash'
  import { type Hex } from 'viem'
  import Portal from 'svelte-portal'
  import { onMount } from 'svelte'

  import ChipList from '$lib/components/ChipList.svelte'
  import Crumb from '$lib/components/Crumb.svelte'
  import IconList from '$lib/components/IconList.svelte'
  import Number from '$lib/components/Number.svelte'
  import PowerSelector from '$lib/components/PowerSelector.svelte'
  import StrategyControls from '$lib/components/StrategyControls.svelte'
  import ToAddressInput from '$lib/components/ToAddressInput.svelte'
  import AccountSummary from '$lib/components/account/Summary.svelte'
  import StepIncrementor from '$lib/components/StepIncrementor.svelte'
  import CancelButton from '$lib/components/CancelButton.svelte'

  import { deposits, poolPower, allPools, nullifiedCommitmentsUnderPool } from '$lib/pools'
  import { crumbs } from '$lib/navigation'
  import { Strategy } from '$common/pools'
  import { tokensOnActiveChain } from '$lib/tokens'
  import { currentAccount as account } from '$lib/wallets'
  import { chain } from '$lib/chain-state'
  import { stickyFilledOnMount } from '$lib/ui'
  import { push } from 'svelte-spa-router'
  import { proofs } from '$lib/db/proofs'
  // import { updatePower } from '$lib/config'
  import { pool } from '$lib/api'
  import { emptyHex, type ChainIds } from '$common/config'
  import { poolIdFromParts } from '$common/utils'

  onMount(stickyFilledOnMount)

  const toggleCommitment = (e: CustomEvent<bigint>) => {
    const leafIndex = e.detail
    if (commitments.has(leafIndex)) commitments.delete(leafIndex)
    else commitments.add(leafIndex)
    commitments = commitments
  }
  const firstNotInSelected = (sorted: bigint[], commitments: Set<bigint>) => {
    return sorted.find((num) => !commitments.has(num))
  }
  // the reason that we sort inside of the handler is because
  // switching strategies does not reorder the set
  const oldestFirst = (a: bigint, b: bigint) => global.Number(a - b)
  const recentFirst = (a: bigint, b: bigint) => global.Number(b - a)
  const random = (bound: number) => Math.floor(Math.random() * bound)
  const chipNotDisabled = (c) => !disabled.has(c)
  const strategyHandlers = {
    [Strategy.OLDEST_FIRST]: (e) => {
      if (e.detail > 0n) {
        const sortedChips = [...chips].filter(chipNotDisabled).sort(oldestFirst)
        const firstNotIn = firstNotInSelected(sortedChips, commitments)
        if (!_.isNil(firstNotIn)) commitments.add(firstNotIn)
      } else {
        const selectedSorted = [...commitments].filter(chipNotDisabled).sort(oldestFirst)
        commitments.delete(selectedSorted[selectedSorted.length - 1])
      }
      commitments = commitments
    },
    [Strategy.RECENT_FIRST]: (e) => {
      if (e.detail > 0n) {
        const sortedChips = [...chips].filter(chipNotDisabled).sort(recentFirst)
        const firstNotIn = firstNotInSelected(sortedChips, commitments)
        if (!_.isNil(firstNotIn)) commitments.add(firstNotIn)
      } else {
        const selectedSorted = [...commitments].filter(chipNotDisabled).sort(recentFirst)
        commitments.delete(selectedSorted[selectedSorted.length - 1])
      }
      commitments = commitments
    },
    [Strategy.RANDOM]: (e) => {
      if (e.detail > 0n) {
        const chipList = [...chips]
        const chipListNotInSelected = chipList.filter(chipNotDisabled).filter((chip) => !commitments.has(chip))
        if (!chipListNotInSelected.length) return
        const randomIndex = random(chipListNotInSelected.length)
        commitments.add(chipListNotInSelected[randomIndex])
      } else {
        const currentlySelected = [...commitments].filter(chipNotDisabled)
        commitments.delete(currentlySelected[random(currentlySelected.length)])
      }
      commitments = commitments
    },
  } as Record<Strategy, (e: CustomEvent<bigint>) => void>
  const broadcast = async () => {
    // save work in database
    // goto work performance visualization page (table of work progress)
    // there, the user can see the progress of the work
    // console.log('broadcast', $account, toAddress, feePerCommitment, commitments, power, selectedIndex, $deposits)
    const depositsUnderPool = $deposits[poolAddress].filter((deposit) => commitments.has(BigInt(deposit.leafIndex)))
    const p = deposits[0].pool
    await pool.generateProofsAndCache(
      $chain.id as ChainIds,
      $account!,
      toAddress,
      feePerCommitment,
      p,
      depositsUnderPool,
    )
    // chain id is from bottom right dropdown
    push(`/account/shield/work/${p.id}`)
  }

  let power = $poolPower || 15
  let selectedIndex = 0
  let commitments = new Set<bigint>()
  let feeBasisPoints = 25n
  let strategy: Strategy = Strategy.OLDEST_FIRST
  $: poolAddress = getAddress($allPools[power]?.[selectedIndex] || zeroAddress)
  $: poolId = poolIdFromParts($chain.id as ChainIds, poolAddress)
  $: disabled = new Set<bigint>(
    $proofs
      .filter((proof) => proof.pool_id === poolId)
      .map((proof) => BigInt(proof.leaf_index))
      .concat($nullifiedCommitmentsUnderPool),
  )
  $: chips = new Set(_.sortBy($deposits[poolAddress]?.map((d) => BigInt(d.leafIndex)) || [], (i) => i))
  $: if (disabled) {
    commitments = new Set([...commitments.values()].filter((chip) => !disabled.has(chip)))
  }
  let toAddress: Hex = emptyHex
  $: icons =
    ($deposits &&
      $allPools[power]?.map((pool) => ({
        title: pool,
        badge: $deposits[getAddress(pool)]?.length || 0,
        type: 'pk' as const,
      }))) ||
    []
  $: selected = icons[0]

  // $: updatePower(power)

  $: denomination = 10n ** BigInt(power)
  $: feePerCommitment = (denomination * feeBasisPoints) / 10_000n
  $: total = denomination * BigInt(commitments.size)
  $: fee = feePerCommitment * BigInt(commitments.size)
  $: receivePerCommitment = denomination - feePerCommitment
  $: receive = receivePerCommitment * BigInt(commitments.size)
  $: token = $tokensOnActiveChain[0]
  // default to using the oldest first because that is generally safest
  $: proofGenerationDisabled = !isAddress(toAddress) || commitments.size === 0
</script>

<Crumb {...crumbs.broadcast} />

<div class="flex flex-col gap-4 px-4">
  {#if $account}
    <AccountSummary account={$account} />
  {/if}
  <PowerSelector bind:power />
  <IconList {icons} bind:selected />
  <ChipList {chips} bind:selected={commitments} {disabled} on:toggle={toggleCommitment} />
  <div class="flex flex-row items-center justify-between text-sm leading-6">
    <span class="flex flex-row items-center gap-2">
      <StrategyControls bind:strategy />
      <span
        class="input-group input-group-divider bg-surface-200-700-token flex w-auto flex-row border-none p-0 outline outline-1 -outline-offset-1 outline-primary-400">
        <StepIncrementor
          padding="p-0"
          size="size-8"
          decrementDisabled={commitments.size === 0}
          incrementDisabled={commitments.size === chips.size}
          on:change={strategyHandlers[strategy]} />
      </span>
    </span>
  </div>
  <div class="flex flex-col">
    <div class="flex flex-row items-center gap-2">
      <span class="w-20 font-bold"><span class="inline-block w-4"></span>Total</span>
      <span class="italic">
        <Number x={total} />
      </span>
    </div>
    <div class="flex flex-row items-center gap-2">
      <span class="w-20 font-bold"><span class="inline-block w-4">-&nbsp;</span>Fee</span>
      <span class="italic">
        <Number x={fee} />
        <span>(<Number x={feeBasisPoints} decimals={2} />%)</span>
      </span>
    </div>
    <div class="flex flex-row items-center gap-2">
      <span class="w-20 font-bold"><span class="inline-block w-4">&equals;&NonBreakingSpace;</span>Receive</span>
      <span class="italic">
        <Number x={receive} />
        <span>{token.metadata.symbol}</span>
      </span>
    </div>
  </div>
  <ToAddressInput bind:toAddress />
</div>
<Portal target="#sticky-portal">
  <div class="flex w-full flex-row items-center gap-2 bg-primary-50 px-4 py-2 shadow-inner">
    <button class="variant-filled-primary btn w-full" disabled={proofGenerationDisabled} on:click={broadcast}
      >Broadcast</button>
    <CancelButton backup="/account">Cancel</CancelButton>
  </div>
</Portal>
