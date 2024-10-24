import * as viemChains from 'viem/chains'
import mainnetLogo from '$lib/assets/chains/0x1.png'
import pulsechainLogo from '$lib/assets/chains/0x171.png'
import pulsechainTestnetV4Logo from '$lib/assets/chains/0x3af.png'
import type { Chain } from '$common/token'

const ethereumAlt = 'two piramids with 1 side touching'

const pulsechainAlt = 'hexagon with an ekg pulse through the middle'

const second = 1_000

const mainnet = {
  id: viemChains.mainnet.id,
  logoURI: mainnetLogo,
  alt: ethereumAlt,
  blockTime: 12 * second,
  gasUnit: 'gwei',
} as Chain

const pulsechain = {
  id: viemChains.pulsechain.id,
  logoURI: pulsechainLogo,
  alt: pulsechainAlt,
  blockTime: 10 * second,
  gasUnit: 'beat',
} as Chain

const pulsechainTestnetV4 = {
  id: viemChains.pulsechainV4.id,
  logoURI: pulsechainTestnetV4Logo,
  alt: pulsechainAlt,
  blockTime: 10 * second,
  gasUnit: 'beat',
} as Chain

export const chains = {
  mainnet,
  pulsechain,
  pulsechainTestnetV4,
} as const

export const chainById = new Map<number, Chain>(Object.values(chains).map((chain) => [+chain.id, chain]))
