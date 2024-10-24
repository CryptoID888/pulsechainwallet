<script lang="ts">
  import { proofs } from '$lib/db/proofs'
  import { onMount } from 'svelte'
  import { getWithdrawal } from '$lib/ponder'
  import { getDB, queries } from '$lib/db'
  import { type Hex, encodeFunctionData } from 'viem'
  import { PrivacyPoolAbi } from '$common/abis/PrivacyPool'
  import type { WithdrawalProofStruct } from '$lib/types'
  import { chainIdToChain, getPublicClient } from '$lib/chain-state'
  import { doWork } from '$lib/work'

  // let currentlyWorking = false
  const startWork = async (chainId: number, poolId: Hex, leafIndex: number, calldata: Hex) => {
    const chain = chainIdToChain.get(chainId)
    if (!chain) {
      console.error('chain not found', chainId)
      return
    }
    const rpcUrl = chain.rpcUrls.default.http[0]
    const provider = getPublicClient(chain)
    const board = new msgboard.MsgBoard(msgboard.wrap1193(provider as any))
    const db = await getDB()!
    // console.log('starting work', poolId, leafIndex)
    await doWork({
      rpcUrl,
      category: poolId,
      text: calldata,
      cancel: async () => {
        console.log('cancelling work', poolId, leafIndex)
        await db.execute(queries.UPDATE_WORK_STATE, [poolId, leafIndex, 'cancelled'])
      },
      progress: async () => {
        console.log('progress', poolId, leafIndex)
        await db.execute(queries.UPDATE_WORK_ACTIVITY, [poolId, leafIndex])
      },
      complete: async (work: msgboard.Work) => {
        console.log('complete', poolId, leafIndex)
        const id = await board.add(work.toRLP())
        await Promise.all([
          db.execute(queries.UPDATE_WORK_STATE, [poolId, leafIndex, 'broadcasted']),
          db.execute(queries.UPDATE_MSG_ID, [poolId, leafIndex, id]),
        ])
      },
    })
    await db.execute(queries.UPDATE_WORK_STATE, [poolId, leafIndex, 'working'])
    // console.log('started work', poolId, leafIndex)
    // once we are here, the service worker is running
    // currentlyWorking = true
  }
  const ensureWorkIsBeingPerformed = async () => {
    const db = await getDB()!
    if (!db) return
    for (const proof of $proofs) {
      const { pool_id, leaf_index, calldata, work_state, last_work_activity_time } = proof
      const poolId = pool_id as Hex
      if (work_state !== 'waiting') {
        // if it's not waiting, then it's either working, broadcast, or mined
        // if it's working, then we need to wait until it's broadcast
        // we should check that the last_work_activity_time is recent
        // if it's broadcast, then we need to wait until it's mined
        // we should check that the last_work_broadcast_time is recent
        // if it's mined, then we need to check the next proof
        if (work_state === 'working') {
          // check that the last_work_activity_time is recent
          // if it's not recent, then we need to mark it as failed
          // if it's recent, then we need to continue
          if (!last_work_activity_time) {
            // this script got to the activity loop. mark it as if it were working
            await db.execute(queries.UPDATE_WORK_ACTIVITY, [pool_id, leaf_index])
            return
          }
          const lastWorkActivityTime = last_work_activity_time.includes('Z')
            ? new Date(last_work_activity_time)
            : new Date(`${last_work_activity_time.split(' ').join('T')}Z`)
          const now = new Date()
          const timeSinceLastWork = now.getTime() - lastWorkActivityTime.getTime()
          if (timeSinceLastWork > 1000 * 30) {
            // if work has not been updated in 30 seconds, then restart
            console.log('resetting work state=%o', 'waiting', poolId, leaf_index)
            await db.execute(queries.RESET_WORK_STATE, [poolId, leaf_index])
            return
            // await db.execute(queries.UPDATE_WORK_STATE, [pool_id, leaf_index, 'failed'])
          }
          console.log('still working', poolId, leaf_index, timeSinceLastWork, last_work_activity_time)
          return
        }
        // if (work_state === 'broadcasted') {
        //   return
        // }
        // if (work_state === 'mined') {
        //   continue
        // }
        continue
      }
      const parsedCalldata = JSON.parse(calldata) as WithdrawalProofStruct
      const { deposit, withdrawal } = await getWithdrawal(poolId, leaf_index, parsedCalldata.nullifier)
      if (withdrawal) {
        // mark as finished
        await db.execute(queries.UPDATE_WORK_STATE, ['mined', poolId, leaf_index])
        // check the next proof
        continue
      }
      const encodedCalldata = encodeFunctionData({
        abi: PrivacyPoolAbi,
        functionName: 'verifyWithdrawal',
        args: [
          {
            accessType: Number(parsedCalldata.accessType),
            bitLength: Number(parsedCalldata.bitLength),
            subsetData: parsedCalldata.subsetData,
            flatProof: parsedCalldata.flatProof.map((hex) => BigInt(hex)) as [
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
            ],
            root: parsedCalldata.root,
            subsetRoot: parsedCalldata.subsetRoot,
            nullifier: parsedCalldata.nullifier,
            recipient: parsedCalldata.recipient,
            refund: BigInt(parsedCalldata.refund),
            relayer: parsedCalldata.relayer,
            fee: BigInt(parsedCalldata.fee),
            deadline: BigInt(parsedCalldata.deadline),
          },
          // [
          //   BigInt(parsedCalldata.accessType),
          //   Number(parsedCalldata.bitLength),
          //   parsedCalldata.subsetData,
          //   [
          //     BigInt(parsedCalldata.flatProof[0]),
          //     BigInt(parsedCalldata.flatProof[1]),
          //     BigInt(parsedCalldata.flatProof[2]),
          //     BigInt(parsedCalldata.flatProof[3]),
          //     BigInt(parsedCalldata.flatProof[4]),
          //     BigInt(parsedCalldata.flatProof[5]),
          //     BigInt(parsedCalldata.flatProof[6]),
          //     BigInt(parsedCalldata.flatProof[7]),
          //   ],
          //   parsedCalldata.root,
          //   parsedCalldata.subsetRoot,
          //   parsedCalldata.nullifier,
          //   parsedCalldata.recipient,
          //   BigInt(parsedCalldata.refund),
          //   parsedCalldata.relayer,
          //   BigInt(parsedCalldata.fee),
          //   BigInt(parsedCalldata.deadline),
          // ] as const,
        ],
      })
      await startWork(deposit.pool.chainId, poolId, leaf_index, encodedCalldata)
    }
  }
  let id: ReturnType<typeof setTimeout>
  const watch = (fn: () => Promise<void>) => {
    const i = id
    fn().then(() => {
      if (i === id) {
        id = setTimeout(() => {
          watch(fn)
        }, 3_000)
      }
    })
    return () => {
      clearTimeout(id)
    }
  }

  const watchProofs = () => {
    return watch(ensureWorkIsBeingPerformed)
  }
  onMount(watchProofs)
</script>

<slot />
