import type { ChainIds } from '$common/config'
import { selectedChains } from './chain-state'

export type TLD = `.${string}`

export const chainIdToTLD = new Map<ChainIds, TLD>([
  [selectedChains.ethereum, '.eth'],
  [selectedChains.pulsechain, '.pls'],
])

export const tldToChainId = [...chainIdToTLD.entries()].reduce((collected, [chainId, tld]) => {
  collected.set(tld, chainId)
  return collected
}, new Map<TLD, ChainIds>())
