import * as viem from 'viem'
import { config } from '../config';
import { chainIdToChain, getPublicClient } from './mappings'
import { derived, Stores, writable } from 'svelte/store';
export * from './mappings'

export const chain = derived<Stores, viem.Chain>([config], ([$config]) => {
  return chainIdToChain.get($config.chainId)!
})

export const currentPublicClient = derived<Stores, viem.PublicClient>([chain], ([$chain]) => {
  return getPublicClient($chain)
})

export const currentBlock = writable<viem.Block | null>(null)
