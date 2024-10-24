import type { Hex, TransactionRequestEIP1559, TransactionRequestLegacy } from 'viem'
import type { Account } from '$common/wallets'
import { persisted } from 'svelte-persisted-store'
import type { FeeType } from './settings'
import _ from 'lodash'

type Transaction = {
  hash: Hex
  chainId: number
}

export type PrepConfig = {
  from: Account
  to: Hex
  data: Hex
  value: bigint
}

const txHistory = persisted<Transaction[]>('txhistory', [])
export const transactions = {
  ...txHistory,
  push: (tx: Transaction) => {
    return txHistory.update((txs) => _.uniqBy(txs.concat(tx), ($tx) => $tx.hash))
  },
}

type RawTxOverridableType = Omit<
  TransactionRequestLegacy<bigint, number, 'legacy'> | TransactionRequestEIP1559<bigint, number, 'eip1559'>,
  'type'
>

export type ViemRawTransaction = RawTxOverridableType & {
  type: FeeType
}

export type RawTransaction = RawTxOverridableType & {
  type: bigint
}

export const transactionFormation = persisted<Partial<RawTransaction> | null>('transaction-formation', null)
