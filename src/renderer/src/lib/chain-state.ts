import * as viem from 'viem'
import { derived, type Stores } from 'svelte/store'
import { derived as derivedSlave } from '$lib/event-store'
import { config } from '$lib/config'
import * as viemChains from '$common/chains'
import { state } from '$lib/api'

export const chainIdToChain = new Map<number, viem.Chain>(
  Object.values(viemChains).map((c) => [c.id, c]),
)

export const chain = derived([config], ([$config]) => {
  if (!$config) return null
  return chainIdToChain.get($config.chainId) || null
})

export const selectedChains = {
  ethereum: 1,
  pulsechain: 369,
  pulsechainV4: 943,
} as const

export const currentBlock = derivedSlave<Stores, viem.Block | null>('state:block', [config], ([$config]) => {
  return state.block($config.chainId)
}, null)
