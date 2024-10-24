import { currentAccount } from "./wallets";
import { chain } from "./chain-state";
import { loading } from "./loading";
import _ from "lodash";
import type { Deposit, KnownCommitmentsResponse } from "$common/indexer";
import { getAddress, type Hex } from "viem";
import type { AllPoolsUnderAssetQuery } from '$common/indexer'
import { native } from '$common/pools'
import { config } from '$lib/config'
import { derived as derivedSlave } from '$lib/event-store'
import { log10 } from '$lib/number'
import { derived, type Stores } from 'svelte/store'
import { indexer, wallet } from '$lib/api'

/** the pool power that was last focused on for the chain currently selected */
export const poolPower = derived([config], ([$config]) => {
  if (!$config) return null
  return $config.byChain[$config.chainId]?.poolPower || null
})

/**
 * all pools under the current asset for the chain currently selected
 * @notice this store does not listen for updates so that will have to be handled separately
 */
export const allPools = derivedSlave<Stores, Hex[][]>(null, [config], async ([$config]) => {
  return indexer.query<AllPoolsUnderAssetQuery>('ALL_POOLS_UNDER_ASSET', {
    chainId: $config?.chainId,
    asset: native,
  }).catch(() => ({
    // if query fails, return empty array can be handled more gracefully later
    privacyPools: { items: [] }
  })).then((result) => {
    const { privacyPools } = result
    return _(privacyPools.items).reduce((groupings, item) => {
      const power = log10(BigInt(item.denomination))
      const list = groupings[power] || []
      list.push(item.address)
      groupings[power] = list
      return groupings
    }, _.range(0, 79).map(() => [] as Hex[]))
  })
}, [])

/** the last pool in the list of pools under the current asset for the chain currently selected */
export const lastPool = derived([allPools], ([$allPools]) => {
  return $allPools.map((pool) => pool[pool.length - 1] || null)
}, [])

/** the pools under the current power for the chain currently selected */
export const poolsUnderPower = derived([allPools, poolPower], ([$allPools, $poolPower]) => {
  return $allPools[$poolPower]
})

/** the deposits for the current account under the current power for the chain currently selected */
export const deposits = derived([currentAccount, chain, allPools, poolPower], ([$account, $chain, $allPools, $power], set) => {
  let cancelled = false
  if (!$power) {
    set({})
    return () => { }
  }
  loading.increment('pools')
  Promise.all(
    ($allPools[$power] || []).map((pool) => {
      return wallet.commitmentFromAccountSignature($account!, $chain!, pool)
    }),
  ).then(async (commitments) => {
    if (cancelled) return cleanup()
    const filteredCommitments = _(commitments).compact().uniq().value()
    if (!filteredCommitments.length) {
      set({})
      cleanup()
      return
    }
    const { deposits: { items: deposits } } = await indexer.query<KnownCommitmentsResponse>('DEPOSITS_FROM_COMMITMENTS', {
      commitments: filteredCommitments,
    })
    if (cancelled) return cleanup()
    const depositsByPoolAddress = _.groupBy(deposits, (d) => getAddress(d.pool.address))
    set(depositsByPoolAddress)
    cleanup()
  })
  const cleanup = () => {
    if (cancelled) return
    cancelled = true
    loading.decrement('pools')
  }
  return cleanup
}, {} as Record<Hex, Deposit[]>)
