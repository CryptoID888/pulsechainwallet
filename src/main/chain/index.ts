import * as viem from 'viem'
import { derived, Stores, writable } from 'svelte/store'

import { config } from '$main/config'
import { chainIdToChain, getPublicClient } from '$main/chain/mappings'
export * from '$main/chain/mappings'

export const chain = derived<Stores, viem.Chain>([config], ([$config]) => {
  return chainIdToChain.get($config.chainId)!
})

export const currentPublicClient = derived<Stores, viem.PublicClient>([chain], ([$chain]) => {
  return getPublicClient($chain)
})

export const currentBlock = writable<viem.Block | null>(null)
