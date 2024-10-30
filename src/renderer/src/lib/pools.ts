import { currentAccount } from "./wallets";
import { chain, currentBlock } from "./chain-state";
import { loading } from "./loading";
import _ from "lodash";
import type { Deposit, PrivacyPool } from "$common/indexer/gql/graphql";
import { getAddress, type Hex } from "viem";
import { maxPower } from '$common/pools'
import { config } from '$lib/config'
import { derived as derivedSlave } from '$lib/event-store'
import { log10 } from '$lib/number'
import { derived, type Stores } from 'svelte/store'
import { indexer, pool } from '$lib/api'
import type { ChainIds } from "$common/config";
import { poolIdFromParts } from "$common/utils";

/** the pool power that was last focused on for the chain currently selected */
export const poolPower = derived([config], ([$config]) => {
  if (!$config) return null
  return $config.byChain[$config.chainId]?.poolPower || null
})

export const factory = derived([config], ([$config]) => {
  if (!$config) return null
  return $config.byChain[$config.chainId]?.pools?.factory || null
})

/**
 * all pools under the current asset for the chain currently selected
 * @notice this store does not listen for updates so that will have to be handled separately
 */
export const allPools = derivedSlave<Stores, Hex[][]>(null, [config], async ([$config]) => {
  const result = await indexer.queryAllPoolsUnderChainId($config?.chainId).catch(() => ({
    // if query fails, return empty array can be handled more gracefully later
    privacyPools: { items: [] }
  }))
  const { privacyPools } = result
  return _(privacyPools.items).reduce((groupings, item) => {
    const power = log10(BigInt(item.denomination))
    const list = groupings[power] || []
    list.push(item.address)
    groupings[power] = list
    return groupings
  }, _.range(0, maxPower).map(() => [] as Hex[]))
}, [])

/** the last pool in the list of pools under the current asset for the chain currently selected */
export const lastPool = derived([allPools], ([$allPools]) => {
  return $allPools.map((pool) => pool[pool.length - 1] || null)
}, [])

/** the pools under the current power for the chain currently selected */
export const poolsUnderPower = derived([allPools, poolPower], ([$allPools, $poolPower]) => {
  return $allPools[$poolPower] || []
})

export const latestPoolUnderPower = derived<Stores, PrivacyPool | null>([config, currentBlock, poolsUnderPower], ([$config, $block, $poolsUnderPower], set) => {
  const poolAddress = $poolsUnderPower[$poolsUnderPower.length - 1]
  if (!$block || !poolAddress) {
    set(null)
    return _.noop
  }
  let cancelled = false
  const cleanup = () => {
    cancelled = true
  }
  const poolId = poolIdFromParts($config!.chainId, poolAddress)
  indexer.query('POOL_BY_ID', {
    poolId,
  }).then(({ privacyPools: { items: [privacyPool] } }) => {
    if (cancelled) return
    set(privacyPool || null)
  }).catch(console.log).then(cleanup)
  return cleanup
})

export const nullifiedCommitmentsUnderPool = derived<Stores, bigint[]>(
  // add in a manual secret input here in the future to allow user to control secret
  [currentAccount, chain, allPools, poolPower],
  ([$account, $chain, $allPools, $power], set) => {
    let cancelled = false
    if (!$power || !$account) {
      set([])
      return _.noop
    }
    loading.increment('pools')
    const cleanup = () => {
      if (cancelled) return
      cancelled = true
      loading.decrement('pools')
    }
    Promise.all(
      ($allPools[$power] || []).map(async (p) => {
        return await pool.nullifiedCommitmentIndices($account!, $chain!.id as ChainIds, p)
      }),
    ).then((commitments: bigint[][]) => {
      if (cancelled) return
      const filteredCommitments = _(commitments)
        .flatten()
        .filter(_.negate(_.isNil))
        .uniq()
        .value()
      set(filteredCommitments)
      cleanup()
    })
    return cleanup
  }
)

export const commitmentsUnderPool = derived<Stores, Hex[]>(
  // add in a manual secret input here in the future to allow user to control secret
  [currentAccount, chain, allPools, poolPower],
  ([$account, $chain, $allPools, $power], set) => {
    let cancelled = false
    if (!$power || !$account) {
      set([])
      return _.noop
    }
    loading.increment('pools')
    const cleanup = () => {
      if (cancelled) return
      cancelled = true
      loading.decrement('pools')
    }
    Promise.all(
      ($allPools[$power] || []).map((p) => {
        return pool.commitmentFromAccountSignature($account!, $chain!.id as ChainIds, p)
      }),
    ).then(commitments => {
      if (cancelled) return
      const filteredCommitments = _(commitments).compact().uniq().value()
      set(filteredCommitments)
    }).catch(console.log).then(cleanup)
    return cleanup
  },
  [] as Hex[],
)

/** the deposits for the current account under the current power for the chain currently selected */
export const deposits = derived(
  [allPools, poolPower, commitmentsUnderPool],
  ([$allPools, $power, $commitments], set) => {
    let cancelled = false
    if (!$power) {
      set({})
      return _.noop
    }
    if (!$commitments.length) {
      set({})
      return _.noop
    }
    loading.increment('pools')
    const cleanup = () => {
      if (cancelled) return
      cancelled = true
      loading.decrement('pools')
    }
    const poolAddress = $allPools[$power]?.[0]
    indexer.query('DEPOSITS_FROM_COMMITMENTS', {
      poolAddress,
      commitments: $commitments,
    }).then((data) => {
      if (cancelled) return
      const {
        privacyPools: { items: [privacyPool] },
      } = data
      const deposits = privacyPool.deposits.items.map((deposit) => ({
        ...deposit,
        pool: privacyPool,
      }))
      const depositsByPoolAddress = _.groupBy(deposits, (d) => (
        getAddress(d.pool.address)
      ))
      set(depositsByPoolAddress)
    }).catch(console.log).then(cleanup)
    return cleanup
  }, {} as Record<Hex, Deposit[]>)
