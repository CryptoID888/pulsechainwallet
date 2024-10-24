import { AllKnownLeavesResponse, Deposit, DepositAtResponse, KnownCommitmentsResponse, WithdrawalAtResponse } from "$common/indexer"
import { Hex } from "viem"
import { query } from "."

export const fetchDepositsFromCommitments = async (commitments: Hex[]) => {
  return await query<KnownCommitmentsResponse>('DEPOSITS_FROM_COMMITMENTS', {
    commitments,
  }).then((data) => {
    return data.deposits.items
  }, (err) => {
    console.log('error', err)
    return [] as Deposit[]
  })
}

export const fetchLeavesUnderPool = async (poolId: Hex) => {
  return await query<AllKnownLeavesResponse>('LEAVES_UNDER_POOL', {
    poolId,
  }).then((data) => {
    return data.deposits.items.map((item) => item.leaf)
  }, (err) => {
    console.log('error', err)
    return [] as Hex[]
  })
}

export const getDeposit = async (poolId: Hex, leafIndex: number) => {
  const {
    deposits: { items: [deposit] },
  } = await query<DepositAtResponse>('DEPOSIT_AT', {
    poolId,
    leafIndex,
  })
  return deposit
}

export const getWithdrawal = async (poolId: Hex, nullifier: Hex) => {
  const {
    withdrawals: { items: [withdrawal] },
  } = await query<WithdrawalAtResponse>('WITHDRAWAL_AT', {
    poolId,
    nullifier,
  })
  return withdrawal
}
