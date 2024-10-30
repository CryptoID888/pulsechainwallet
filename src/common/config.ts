import type { Hex } from "viem"
// import poolsConfig from './pools-config.json'
import { mainnet, pulsechain, pulsechainV4 } from './chains'

export type ChainIds = 1 | 369 | 943

type ScopedChainConfig = {
  /** the pool power that was last focused on for this chain */
  poolPower: number
  /** the rpc urls to use for this chain. default values can be restored */
  rpcs: string[]
  /** the pool config for this chain */
  pools?: PoolConfig
}

type ContractDeployment = {
  transactionHash: Hex
  blockNumber: string;
  address: Hex;
}

type PoolConfig = {
  poseidon: ContractDeployment;
  factory: ContractDeployment;
}

export const maxDecimals = 18

export const feeTypes = {
  LEGACY: 'legacy',
  EIP1559: 'eip1559',
} as const

export const enums = {
  defaultTransactionFeeType: feeTypes,
} as const

export const feeTypesList = Object.values(feeTypes)

export type FeeType = (typeof feeTypesList)[number]

export const defaultControllableSettings = {
  /** the delimiter to use between numbers */
  digitGroupSeparator: ',',
  decimalSeparator: '.',
  /** the number of decimals to show when number > 1 */
  maxDelimiterSets: 3,
  /** the number of characters to show for an address */
  addressTruncation: 6,
  /** the default transaction fee type, only eip1559 or legacy supported */
  defaultTransactionFeeType: 'eip1559' as FeeType,
  /** multiply the estimated gas limit to ensure sufficient gas */
  defaultGasLimitMultiplier: 20_000,
  /** if a transaction is not mined in a provided base fee range, resubmit the transaction */
  autoReplaceUnderpriced: false,
  /** show numbers as base 16 (false) or base 10 (true) */
  numbersOverHex: false,
  /** raises gas price (base fee) 1.125^n. this guarantees that the transaction will be valid for that many blocks */
  baseFeeValidityRange: 6,
  /** utilize some portion of the calculated base fee to calculate the priority fee */
  defaultPriorityFeeAdditive: 1_000,
  /** multiply the priority fee by pf * n / 10000 to get a new priority fee */
  defaultPriorityFeeRetryAdditive: 1_000,
  /** show testnets in the network dropdown */
  showTestnets: false,
  /** use iso when showing timestamps */
  useISOTime: true,
  /** the time delay before a message is considered stale */
  broadcastMessageCutoffTimeDelay: 5 * 60 * 1_000,
  /** the block delay before a message is considered stale */
  broadcastMessageCutoffBlockDelay: 50,
}

export type ControllableSettings = typeof defaultControllableSettings

export type Config = ControllableSettings & {
  // which wallet+account is being focused on currently
  walletCount: number | null
  walletId: Hex | null
  addressIndex: number | null
  chainId: ChainIds
  // indexer is cross chain for now
  indexer: {
    url: string
  }
  byChain: Record<number, ScopedChainConfig>
}

export const defaultConfig: Config = {
  ...defaultControllableSettings,
  walletCount: null,
  walletId: null,
  addressIndex: null,
  chainId: 369,
  indexer: {
    url: 'https://pulsechainwallet-indexer.up.railway.app',
  },
  byChain: {
    [mainnet.id]: {
      poolPower: 18,
      rpcs: [
        'https://rpc-ethereum.g4mm4.io',
      ],
      // pools: pools[mainnet.id],
    },
    [pulsechain.id]: {
      poolPower: 24,
      rpcs: [
        'https://rpc.pulsechain.com',
      ],
      // pools: pools[pulsechain.id],
    },
    [pulsechainV4.id]: {
      poolPower: 15,
      rpcs: [
        'https://rpc-testnet-pulsechain.g4mm4.io',
      ],
      // pools: pools[pulsechainV4.id],
    },
  },
}

export const emptyHex = '0x' as Hex
