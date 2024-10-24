import { selectedChains } from './chain-state'

export type TLD = `.${string}`

export const chainIdToTLD = new Map<number, TLD>([
  [selectedChains.ethereum, '.eth'],
  [selectedChains.pulsechain, '.pls'],
])

export const tldToChainId = [...chainIdToTLD.entries()].reduce((collected, [chainId, tld]) => {
  collected.set(tld, chainId)
  return collected
}, new Map<TLD, number>())
