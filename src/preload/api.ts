import { ipcRenderer } from 'electron'
import type { Account, UpdateableWalletMetadata, WalletMetadata } from '$common/wallets'
import type { SendTransactionParameters, Hex, Chain, GetEnsAddressReturnType, Block, Transaction } from 'viem'
import { PathTypes } from '$common/path'
import type { Config } from '$common/config'
import { Erc20Token } from '$common/token'
import { QueryKey } from '$common/indexer'
import type { RunResult } from 'better-sqlite3';
import { TransactionData } from '$common/types'

export type Key = null | string | string[]

// Custom APIs for renderer
export const api = {
  password: {
    logout: async () => (
      await ipcRenderer.invoke('password:logout') as boolean
    ),
    login: async (pass: string) => (
      await ipcRenderer.invoke('password:login', pass) as boolean
    ),
    check: async (pass: string) => (
      await ipcRenderer.invoke('password:check', pass) as boolean
    ),
    change: async (current: string, newPass: string) => (
      await ipcRenderer.invoke('password:change', current, newPass) as boolean
    ),
  },
  state: {
    transaction: async (chainId: number, hash: Hex) => (
      await ipcRenderer.invoke('state:transaction', chainId, hash) as Transaction
    ),
    transactionData: async (chainId: number, hash: Hex) => (
      await ipcRenderer.invoke('state:transaction:data', chainId, hash) as Partial<TransactionData>
    ),
    transactionWait: async (chainId: number, hash: Hex) => (
      await ipcRenderer.invoke('state:transaction:wait', chainId, hash) as TransactionData
    ),
    block: async (chainId: number) => (
      await ipcRenderer.invoke('state:block', chainId) as Block | null
    ),
    price: async (token: Erc20Token, currentBlockNumber: string) => (
      await ipcRenderer.invoke('state:price', token, currentBlockNumber) as bigint | null
    ),
    balance: async (chainId: number, address: Hex, token: Erc20Token) => (
      await ipcRenderer.invoke('wallet:balance', chainId, address, token) as bigint
    ),
    // latestPools: async (chainId: number) => (
    //   await ipcRenderer.invoke('state:latestPools', chainId)
    // ),
  },
  indexer: {
    start: async () => (
      await ipcRenderer.invoke('indexer:start')
    ),
    stop: async () => (
      await ipcRenderer.invoke('indexer:stop')
    ),
    query: async <T>(query: QueryKey, vars?: object) => (
      await ipcRenderer.invoke('indexer:query', query, vars) as T
    ),
  },
  config: {
    get: async () => {
      return await ipcRenderer.invoke('config:get') as Config
    },
    set: async (k: string | string[], value: any) => (
      await ipcRenderer.invoke('config:set', k, value) as void
    ),
  },
  sql: {
    run: async (key: string, params: any[]) => (
      await ipcRenderer.invoke('sql:run', key, params) as RunResult
    ),
    get: async <T>(key: string, params: any[]) => (
      await ipcRenderer.invoke('sql:get', key, params) as T | null
    ),
    all: async <T>(key: string, params: any[]) => (
      await ipcRenderer.invoke('sql:all', key, params) as T[]
    ),
  },
  wallet: {
    holdPasswordIfCorrect: async (password: string) => (
      await ipcRenderer.invoke('wallet:holdPasswordIfCorrect', password) as boolean
    ),
    get: async (id: Hex) => (
      await ipcRenderer.invoke('wallet:get', id) as WalletMetadata
    ),
    all: async () => (
      await ipcRenderer.invoke('wallet:all') as WalletMetadata[]
    ),
    add: async (secret: Hex | string, pathType: PathTypes) => (
      await ipcRenderer.invoke('wallet:add', secret, pathType) as WalletMetadata
    ),
    update: async (id: Hex, updates: UpdateableWalletMetadata) => (
      await ipcRenderer.invoke('wallet:update', id, updates) as WalletMetadata
    ),
    account: async (id: Hex, addressIndex: number) => (
      await ipcRenderer.invoke('wallet:account', id, addressIndex) as Account
    ),
    nonces: async (chainId: number, address: Hex) => (
      await ipcRenderer.invoke('wallet:nonces', chainId, address) as {
        pending: number
        latest: number
      }
    ),
    derive: async (id: Hex, indices: number[]) => (
      await ipcRenderer.invoke('wallet:derive', id, indices) as Hex[]
    ),
    reveal: async (password: string, id: Hex, addressIndex?: number) => (
      await ipcRenderer.invoke('wallet:reveal', password, id, addressIndex) as string | Hex
    ),
    accounts: async () => (
      await ipcRenderer.invoke('wallet:accounts') as Account[]
    ),
    accountsUnder: async (id: Hex) => (
      await ipcRenderer.invoke('wallet:accountsUnder', id) as Account[]
    ),
    updateAddedAccounts: async (id: Hex, added: number[]) => (
      await ipcRenderer.invoke('wallet:updateAddedAccounts', id, added) as Hex[]
    ),
    sendTransaction: async (chainId: number, account: Account, input: SendTransactionParameters, action: string) => (
      await ipcRenderer.invoke('wallet:sendTransaction', chainId, account, input, action) as Hex
    ),
    secretFromAccountSignature: async (account: Account, chain: Chain, poolAddress: Hex) => (
      await ipcRenderer.invoke('wallet:secretFromAccountSignature', account, chain, poolAddress) as Hex
    ),
    commitmentFromAccountSignature: async (account: Account, chain: Chain, poolAddress: Hex) => (
      await ipcRenderer.invoke('wallet:commitmentFromAccountSignature', account, chain, poolAddress) as Hex
    ),
    estimateGas: async (chainId: number, input: SendTransactionParameters) => (
      await ipcRenderer.invoke('wallet:estimateGas', chainId, input) as number
    ),
    generateProofsAndCache: async ($account: Account, toAddress: Hex, feePerCommitment: bigint, deposits: any[]) => (
      await ipcRenderer.invoke('wallet:generateProofsAndCache', $account, toAddress, feePerCommitment, deposits)
    ),
  },
  ens: {
    getEnsAddress: async (chainId: number, name: string) => {
      return await ipcRenderer.invoke('ens:getEnsAddress', chainId, name) as GetEnsAddressReturnType
    },
    getEns: async (chainId: number, address: Hex) => (
      await ipcRenderer.invoke('ens:getEns', chainId, address) as string | null
    ),
  },
} as const

export type API = typeof api
