import type { Hex, TransactionRequestEIP1559, TransactionRequestLegacy } from 'viem'
import type { Account } from '$common/wallets'
import type { FeeType } from '$common/config'

export type PrepConfig = {
  from: Account
  to: Hex
  data: Hex
  value: bigint
  gas: bigint | null
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
