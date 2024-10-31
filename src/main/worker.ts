import * as msgboard from '@pulsechain/msgboard'
import { type PublicClient, createPublicClient, http } from 'viem'
import { parentPort, workerData, type MessagePort } from 'worker_threads'

import * as types from '$common/types'
import { chainIdToChain } from '$main/chain/mappings'
import { ChainIds } from '$common/config'

const port = parentPort
if (!port) throw new Error('IllegalState')

let worker!: msgboard.MsgBoard
let provider!: PublicClient

const doWork = async (source: MessagePort, data: types.ServiceWorkerMessage) => {
  const chain = chainIdToChain.get(data.chainId as ChainIds)!
  const transport = http(data.rpc)
  provider = createPublicClient({
    transport,
    chain,
  }) as PublicClient
  const breakInterval = 10_000n
  // type assertion to avoid the type checker complaining about the provider
  // seems like the viem type is slightly different from the one expected by msgboard
  worker = new msgboard.MsgBoard(msgboard.wrap1193(provider as types.MsgboardProvider), {
    difficultyFactor:
      !data.hardFactor || !data.easyFactor
        ? [...msgboard.getDifficultyFactor()]
        : [BigInt(data.hardFactor), BigInt(data.easyFactor)],
    eventLoopDelay: 10, // 10ms in event loop break
    breakInterval, // break every 10k iterations
    logger: (method: string, args: unknown[]) => {
      if (typeof method !== 'string' || (!method.startsWith('eth_') && !method.startsWith('msgboard_'))) {
        return
      }
      source.postMessage({
        type: 'log',
        log: method,
        args,
      })
    },
    progress: (work) => {
      source.postMessage({
        type: 'progress',
        work,
      })
    },
  })
  // set a noop interval to keep the service worker from idling and killing itself
  const id = setInterval(() => {}, Number(breakInterval))
  try {
    const work = await worker.doPoW(data.category, data.data)
    if (!work.isValid) {
      // throw it away
      return
    }
    source.postMessage({
      type: 'complete',
      work,
    })
  } finally {
    clearInterval(id)
  }
}

const data = workerData
switch (data.type) {
  case 'cancel':
    worker?.cancel()
    break
  case 'work':
    doWork(port, data as types.ServiceWorkerMessage)
    break
  default:
    console.log(data)
    console.log('unknown message')
    break
}
