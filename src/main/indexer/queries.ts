import { Hex } from "viem"
import { query } from "."

export const fetchLeavesUnderPool = async (poolId: Hex) => {
  return await query('LEAVES_UNDER_POOL', {
    poolId,
  }).then((data) => {
    return data.deposits.items.map((item) => item.leaf as Hex)
  }, (err) => {
    console.log('error', err)
    return [] as Hex[]
  })
}

export const getDeposit = async (poolId: Hex, leafIndex: number) => {
  const {
    deposits: { items: [deposit] },
  } = await query('DEPOSIT_AT', {
    poolId,
    leafIndex,
  })
  return deposit
}

export const getWithdrawal = async (poolId: Hex, nullifier: Hex) => {
  const {
    withdrawals: { items: [withdrawal] },
  } = await query('WITHDRAWAL_AT', {
    poolId,
    nullifier,
  })
  return withdrawal
}
