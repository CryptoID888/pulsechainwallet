import type {
  Block,
  BlockTag,
  GetEnsAddressReturnType,
  Hex,
  SendTransactionParameters,
  Transaction,
  TransactionReceipt,
} from 'viem'
import type { RunResult } from 'better-sqlite3'
import type { IpcMainInvokeEvent } from 'electron'
import type { Message } from '@pulsechain/msgboard'

import type { ChainIds, Config } from '$common/config'
import type { Contact, StatementParams, TransactionData } from '$common/types'
import type { ChainTransaction } from '$common/types'
import type { Erc20Token } from '$common/token'
import type { QueryKey } from '$common/indexer'
import type { Deposit, PrivacyPool, Query } from '$common/indexer/gql/graphql'
import type { UpdateableWalletMetadata } from '$common/wallets'
import type { WalletMetadata, Account } from '$common/wallets'
import type { NonceData } from '$common/wallets'
import type { PathTypes } from '$common/path'
import type { Proof } from '$common/pools'
import { SQLQueryKeys } from './sql'

export interface API {
  'password:logout': () => boolean
  'password:login': (pass: string) => boolean
  'password:check': (pass: string) => boolean
  'password:change': (oldPass: string, newPass: string) => boolean

  'state:transaction': (chainId: ChainIds, hash: Hex) => Transaction
  'state:transactions': () => ChainTransaction[]
  'state:transaction:data': (chainId: ChainIds, hash: Hex) => TransactionData
  'state:transaction:wait': (chainId: ChainIds, hash: Hex) => TransactionReceipt
  'state:block': (chainId: ChainIds) => Block | null
  'state:price': (token: Erc20Token, blockTag: BlockTag | bigint) => bigint | null
  'state:balance': (chainId: ChainIds, address: Hex, token: Erc20Token) => bigint

  'indexer:start': () => void
  'indexer:stop': () => boolean
  'indexer:restart': () => void
  'indexer:query': (queryKey: QueryKey, queryParams: object) => Query
  // goes through a caching layer
  // omit the asset to use native
  'indexer:query:allPoolsUnderChainId': (chainId: ChainIds, asset?: Hex) => Query
  'indexer:query:allDepositsFromCommitments': (poolId: Hex, commitments: Hex[]) => Deposit[]

  'config:get': () => Config
  'config:set': (key: string | string[], value: unknown) => void

  'sql:run': (sql: SQLQueryKeys, ...params: StatementParams[]) => RunResult
  'sql:get': <T>(sql: SQLQueryKeys, ...params: StatementParams[]) => T | null
  'sql:all': <T>(sql: SQLQueryKeys, ...params: StatementParams[]) => T[]

  'wallet:get': (address: Hex) => WalletMetadata
  'wallet:all': () => WalletMetadata[]
  'wallet:add': (address: Hex | string, path: PathTypes) => Hex
  'wallet:update': (address: Hex, update: UpdateableWalletMetadata) => WalletMetadata | null
  'wallet:account': (address: Hex, index: number) => Account | null
  'wallet:accounts': () => Account[]
  'wallet:accountsUnder': (poolAddress: Hex) => Account[]
  'wallet:updateAddedAccounts': (walletId: Hex, added: number[]) => number[]
  'wallet:nonces': (chainId: ChainIds, address: Hex) => NonceData
  'wallet:derive': (address: Hex, path: number[]) => Hex[]
  'wallet:sendTransaction': (
    chainId: ChainIds,
    account: Account,
    input: SendTransactionParameters,
    action: string,
  ) => Hex
  'wallet:queueTransaction': (
    chainId: ChainIds,
    account: Account,
    input: Omit<SendTransactionParameters, 'maxFeePerGas' | 'maxPriorityFeePerGas' | 'nonce'>,
    action: string,
  ) => Hex
  'wallet:estimateGas': (chainId: ChainIds, input: SendTransactionParameters) => bigint
  'wallet:reveal': (pass: string, secret: Hex, index?: number) => string | boolean | null

  'pool:commitmentFromAccountSignature': (account: Account, chainId: ChainIds, poolAddress: Hex) => Hex | null
  'pool:generateProofsAndCache': (
    chainId: ChainIds,
    account: Account,
    recipient: Hex,
    feePerCommitment: bigint,
    pool: PrivacyPool,
    deposits: Deposit[],
  ) => void
  'pool:secretFromAccountSignature': (account: Account, chainId: ChainIds, poolAddress: Hex) => Hex | null
  'pool:allUnderChain': (chainId: ChainIds) => PrivacyPool[]
  'pool:nullifiedCommitmentIndices': (account: Account, chainId: ChainIds, poolAddress: Hex) => bigint[]
  'ens:getEnsAddress': (chainId: ChainIds, name: string) => GetEnsAddressReturnType
  'ens:getEns': (chainId: ChainIds, address: Hex) => string | null

  'contact:all': () => Contact[]
  'contact:upsert': (contact: Contact) => void

  'proof:all': () => Proof[]
  'proof:allByChainId': (chainId: ChainIds) => Proof[]

  'msgboard:contents': (chainId: ChainIds) => Message[]
  'msgboard:pool:contents': (chainId: ChainIds) => {
    messages: Message[]
    pools: PrivacyPool[]
  }
}

export type Invoker<T extends keyof API> = (...args: Parameters<API[T]>) => Promise<ReturnType<API[T]>>

export type InvokerDefaultNull<T extends keyof API> = (
  ...args: Parameters<API[T]>
) => Promise<ReturnType<API[T]> | null>

export type InvokerRequireType<T extends keyof API, R = unknown> = <I extends R>(
  ...args: Parameters<API[T]>
) => Promise<I>

export type InvokerRequireTypeDefaultNull<T extends keyof API, R = unknown> = <I extends R>(
  ...args: Parameters<API[T]>
) => Promise<I | null>

export type HandlerFn<T extends keyof API> = (
  event: IpcMainInvokeEvent,
  ...params: Parameters<API[T]>
) => Promise<ReturnType<API[T]>>

export type DirectHandler<T extends keyof API> = (
  ...params: Parameters<API[T]>
) => Promise<ReturnType<API[T]>> | ReturnType<API[T]>

export const handler =
  <T extends keyof API>(fn: DirectHandler<T>) =>
  (_event: IpcMainInvokeEvent, ...params: Parameters<typeof fn>) =>
    fn(...params)
