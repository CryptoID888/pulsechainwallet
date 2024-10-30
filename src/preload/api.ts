import { ipcRenderer } from 'electron'
import type {
  API as APICommon,
  Invoker,
  InvokerDefaultNull,
  InvokerRequireType,
  InvokerRequireTypeDefaultNull,
} from '$common/api'

export type Key = null | string | string[]

const proxy = <K extends keyof APICommon>(key: K): Invoker<K> => (
  async (...args: Parameters<APICommon[K]>) => (
    await ipcRenderer.invoke(key, ...args)
  )
)

const proxyDefaultNull = <K extends keyof APICommon>(key: K): InvokerDefaultNull<K> => (
  async (...args: Parameters<APICommon[K]>) => (
    await ipcRenderer.invoke(key, ...args)
  )
)

const proxyRequireType = <K extends keyof APICommon, T = any>(key: K): InvokerRequireType<K, T> => (
  async <R extends T>(...args: Parameters<APICommon[K]>) => (
    await ipcRenderer.invoke(key, ...args) as R
  )
)

const proxyRequireTypeDefaultNull = <K extends keyof APICommon, T = any>(key: K): InvokerRequireTypeDefaultNull<K> => (
  async <R extends T>(...args: Parameters<APICommon[K]>) => (
    await ipcRenderer.invoke(key, ...args) as R | null
  )
)

// Custom APIs for renderer
export const api = {
  password: {
    logout: proxy('password:logout'),
    login: proxy('password:login'),
    check: proxy('password:check'),
    change: proxy('password:change'),
  },
  state: {
    transaction: proxy('state:transaction'),
    transactions: proxy('state:transactions'),
    transactionData: proxy('state:transaction:data'),
    transactionWait: proxy('state:transaction:wait'),
    block: proxy('state:block'),
    price: proxy('state:price'),
    balance: proxy('state:balance'),
  },
  indexer: {
    start: proxy('indexer:start'),
    stop: proxy('indexer:stop'),
    restart: proxy('indexer:restart'),
    query: proxy('indexer:query'),
    queryAllPoolsUnderChainId: proxy('indexer:query:allPoolsUnderChainId'),
  },
  config: {
    get: proxy('config:get'),
    set: proxy('config:set'),
  },
  sql: {
    run: proxy('sql:run'),
    get: proxyRequireTypeDefaultNull('sql:get'),
    all: proxyRequireType('sql:all'),
  },
  wallet: {
    get: proxy('wallet:get'),
    all: proxy('wallet:all'),
    add: proxy('wallet:add'),
    update: proxyDefaultNull('wallet:update'),
    account: proxy('wallet:account'),
    nonces: proxy('wallet:nonces'),
    derive: proxy('wallet:derive'),
    reveal: proxy('wallet:reveal'),
    accounts: proxy('wallet:accounts'),
    accountsUnder: proxy('wallet:accountsUnder'),
    updateAddedAccounts: proxy('wallet:updateAddedAccounts'),
    sendTransaction: proxy('wallet:sendTransaction'),
    estimateGas: proxy('wallet:estimateGas'),
  },
  pool: {
    secretFromAccountSignature: proxy('pool:secretFromAccountSignature'),
    commitmentFromAccountSignature: proxy('pool:commitmentFromAccountSignature'),
    generateProofsAndCache: proxy('pool:generateProofsAndCache'),
    nullifiedCommitmentIndices: proxy('pool:nullifiedCommitmentIndices'),
  },
  ens: {
    getEnsAddress: proxy('ens:getEnsAddress'),
    getEns: proxy('ens:getEns'),
  },
  contact: {
    all: proxy('contact:all'),
    upsert: proxy('contact:upsert'),
  },
  proof: {
    all: proxy('proof:all'),
    allByChainId: proxy('proof:allByChainId'),
  },
  msgboard: {
    contents: proxy('msgboard:contents'),
    poolContents: proxy('msgboard:pool:contents'),
  },
} as const

export type API = typeof api
