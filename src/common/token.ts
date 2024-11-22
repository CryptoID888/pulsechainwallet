import type { Hex } from 'viem'
import { type ChainIds } from '$common/config'

export type Erc20TokenMetadata = {
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  alt?: string
  balances?: Record<Hex, bigint>
}

export type Chain = {
  logoURI: string
  alt: string
  id: ChainIds
  blockTime: number
  gasUnit: string
}

export type Erc20Token = {
  address: Hex
  chain: Chain
  metadata: Erc20TokenMetadata
}
