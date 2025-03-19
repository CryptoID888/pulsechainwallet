import type BetterSqlite3 from 'better-sqlite3'
import type { Hex, Abi, Block, TransactionReceipt, Transaction } from 'viem'
import type { wrap1193 } from '@pulsechain/msgboard'

import type { SeedType } from '$common/wallets'

export type Contact = {
  name: string
  address: Hex
  note: string | null
}

export type Call = {
  allowFailure?: boolean
  functionName: string
  target?: Hex
  abi?: Abi
  args?: (bigint | Hex | Hex[])[]
  callData?: Hex
}

export type ServiceWorkerMessage = {
  type: string
  rpc: string
  chainId: number
  data: string
  category: string
  workMultiplier: string
  workDivisor: string
}

export type Tree = {
  label: string
  children: Tree[]
}

export type MessageData = {
  log?: string
  work?: string
  complete?: string
  progress?: string
  type: string
}

export type WithdrawalProofStruct = {
  accessType: number
  bitLength: number
  subsetData: Hex
  flatProof: readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
  root: Hex
  subsetRoot: Hex
  nullifier: Hex
  recipient: Hex
  refund: bigint
  relayer: Hex
  fee: bigint
  deadline: bigint
}

export type TransactionAction = 'send' | 'shield' | 'swap' | 'approve' | 'stake' | 'unstake' | 'assist' | 'deploy'

export type TransactionData = {
  transaction: Transaction
  receipt: TransactionReceipt | null
  block: Block | null
}

export type ChainTransaction = {
  chain_id: number
  hash: Hex
  action: TransactionAction
}

export type Icon = {
  title: string
  badge: number
  type: SeedType
}

export type StatementParams = Parameters<BetterSqlite3.Statement['run']>

export type MsgboardProvider = Parameters<typeof wrap1193>[0]
