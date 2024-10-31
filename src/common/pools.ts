import { decodeFunctionData, encodeFunctionData, type Hex } from 'viem'
import type { ChainIds } from '$common/config'
import { PrivacyPoolAbi } from '$common/abis/PrivacyPool'
import type { WithdrawalProofStruct } from '$common/types'

export enum Strategy {
  OLDEST_FIRST = 'oldest-first',
  RECENT_FIRST = 'recent-first',
  RANDOM = 'random',
}

export const native: Hex = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const maxPower = 77

export const maxTotalDeposits = 2n ** 20n

export const allPossiblePowers = new Array(maxPower).fill(0).map((_v, i) => BigInt(i))

export type ProofWorkState = 'waiting' | 'working' | 'broadcasted' | 'mined'

export type InsertableProof = {
  chain_id: ChainIds
  pool_id: Hex
  leaf_index: number
  work_state: ProofWorkState
  user_inputs: string
  secret: Hex
}

export type Proof = InsertableProof & {
  message_hash: Hex | null
  last_work_activity_time: string | null
  last_work_broadcast_time: string | null
  created_at: string
  calldata: Hex | null
  access_list: string | null
}

export const verifyWithdrawal = {
  encode: (calldata: WithdrawalProofStruct) =>
    encodeFunctionData({
      abi: PrivacyPoolAbi,
      functionName: 'verifyWithdrawal',
      args: [calldata],
    }),
  decode: (data: Hex) => {
    return decodeFunctionData({
      abi: PrivacyPoolAbi,
      data,
    }) as {
      args: [WithdrawalProofStruct]
      functionName: 'verifyWithdrawal'
    }
  },
}
