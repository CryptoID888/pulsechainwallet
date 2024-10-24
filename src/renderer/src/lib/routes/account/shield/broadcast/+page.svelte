<script lang="ts">
  import { isAddress } from 'viem'
  import _ from 'lodash'
  import type { Hex } from 'viem'
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

  import { deposits, poolPower, allPools } from '$lib/pools'
  import { crumbs } from '$lib/navigation'
  import { Strategy } from '$common/pools'
  import { tokensOnActiveChain } from '$lib/tokens'
  import { currentAccount as account } from '$lib/wallets'
  import { stickyFilledOnMount } from '$lib/ui'
  import { push } from 'svelte-spa-router'
  import { proofs } from '$lib/db/proofs'
  import { updatePower } from '$lib/config'
  import { wallet } from '$lib/api'

  onMount(stickyFilledOnMount)

  const toggleSelected = (e: CustomEvent<bigint>) => {
    const leafIndex = e.detail
    if (selected.has(leafIndex)) {
      selected.delete(leafIndex)
    } else {
      selected.add(leafIndex)
    }
    selected = selected
  }
  const firstNotInSelected = (sorted: bigint[], selected: Set<bigint>) => {
    return sorted.find((num) => !selected.has(num))!
  }
  // the reason that we sort inside of the handler is because
  // switching strategies does not reorder the set
  const oldestFirst = (a: bigint, b: bigint) => global.Number(a - b)
  const recentFirst = (a: bigint, b: bigint) => global.Number(b - a)
  const random = (bound: number) => Math.floor(Math.random() * bound)
  const strategyHandlers = {
    [Strategy.OLDEST_FIRST]: (e) => {
      if (e.detail > 0n) {
        const sortedChips = [...chips].sort(oldestFirst)
        selected.add(firstNotInSelected(sortedChips, selected))
      } else {
        const selectedSorted = [...selected].sort(oldestFirst)
        selected.delete(selectedSorted[selectedSorted.length - 1])
      }
      selected = selected
    },
    [Strategy.RECENT_FIRST]: (e) => {
      if (e.detail > 0n) {
        const sortedChips = [...chips].sort(recentFirst)
        selected.add(firstNotInSelected(sortedChips, selected))
      } else {
        const selectedSorted = [...selected].sort(recentFirst)
        selected.delete(selectedSorted[selectedSorted.length - 1])
      }
      selected = selected
    },
    [Strategy.RANDOM]: (e) => {
      if (e.detail > 0n) {
        const chipList = [...chips]
        const chipListNotInSelected = chipList.filter((chip) => !selected.has(chip))
        const randomIndex = random(chipListNotInSelected.length)
        selected.add(chipListNotInSelected[randomIndex])
      } else {
        const selectedList = [...selected]
        selected.delete(selectedList[random(selectedList.length)])
      }
      selected = selected
    },
  } as Record<Strategy, (e: CustomEvent<bigint>) => void>
  const broadcast = async () => {
    // save work in database
    // goto work performance visualization page (table of work progress)
    // there, the user can see the progress of the work
    const deposits = $deposits[$allPools[power]?.[selectedIndex]].filter((deposit) =>
      selected.has(BigInt(deposit.leafIndex)),
    )
    // const proofs = await generateProofs($account!, toAddress, feePerCommitment, deposits)
    // await cacheProofs(proofs)
    await wallet.generateProofsAndCache($account!, toAddress, feePerCommitment, deposits)
    push('/account/shield/work')
  }

  let power = $poolPower || 15
  // let knownCommitments: Hex[] = []
  // let commitmentInput: Hex | null = null

  let selectedIndex = 0
  let selected = new Set<bigint>()
  let feeBasisPoints = 25n
  let strategy: Strategy = Strategy.OLDEST_FIRST
  $: disabled = new Set<bigint>($proofs.map((proof) => BigInt(proof.leaf_index)))
  let toAddress: Hex = '0x'
  $: icons =
    ($deposits &&
      $allPools[power]?.map((pool) => ({
        title: pool,
        badge: $deposits[pool]?.length || 0,
        type: 'pk' as const,
      }))) ||
    []

  $: updatePower(power)

  $: chips = new Set(
    _.sortBy($deposits[$allPools[power]?.[selectedIndex]]?.map((d) => BigInt(d.leafIndex)) || [], (i) => i),
  )
  $: denomination = 10n ** BigInt(power)
  $: feePerCommitment = (denomination * feeBasisPoints) / 10_000n
  $: total = denomination * BigInt(selected.size)
  $: fee = feePerCommitment * BigInt(selected.size)
  $: receivePerCommitment = denomination - feePerCommitment
  $: receive = receivePerCommitment * BigInt(selected.size)
  $: token = $tokensOnActiveChain[0]
  // default to using the oldest first because that is generally safest
  $: proofGenerationDisabled = !isAddress(toAddress) || selected.size === 0
</script>

<Crumb {...crumbs.broadcast} />

<div class="flex flex-col gap-4 px-4">
  {#if $account}
    <AccountSummary account={$account} />
  {/if}
  <PowerSelector bind:power />
  <IconList {icons} bind:selectedIndex />
  <ChipList {chips} bind:selected {disabled} on:toggle={toggleSelected} />
  <div class="flex flex-row items-center justify-between text-sm leading-6">
    <span class="flex flex-row items-center gap-2">
      <StrategyControls bind:strategy />
      <span
        class="input-group input-group-divider bg-surface-200-700-token flex w-auto flex-row border-none p-0 outline outline-1 -outline-offset-1 outline-primary-400">
        <StepIncrementor
          padding="p-0"
          size="size-8"
          decrementDisabled={selected.size === 0}
          incrementDisabled={selected.size === chips.size}
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
