import * as types from '$common/types'
import * as msgboard from '@pulsechain/msgboard'
import { createPublicClient, http, type PublicClient } from 'viem';
import { chainIdToChain } from '../chain';
import { parentPort } from 'node:worker_threads'

// const sw = self as unknown as ServiceWorkerGlobalScope;

let worker!: msgboard.MsgBoard
let provider!: PublicClient

window.addEventListener('activate', () => {
  console.log('service worker activated')
})
window.addEventListener('message', (e) => {
  const data = JSON.parse(e.data) as Partial<types.ServiceWorkerMessage> & {
    type: string;
  }
  const source = e.source
  switch (data.type) {
    case 'cancel':
      worker?.cancel()
      break
    case 'work':
      doWork(source, data as types.ServiceWorkerMessage)
      break
    default:
      console.log(e)
      console.log('unknown message')
      break
  }
})

const doWork = async (source: Client, data: types.ServiceWorkerMessage) => {
  const chain = chainIdToChain.get(data.chainId)!
  provider = createPublicClient({
    transport: http(data.rpc),
    chain,
  })
  const breakInterval = 10_000n
  worker = new msgboard.MsgBoard(msgboard.wrap1193(provider as PublicClient), {
    difficultyFactor: !data.hardFactor || !data.easyFactor
      ? [...msgboard.getDifficultyFactor()]
      : [BigInt(data.hardFactor), BigInt(data.easyFactor)],
    eventLoopDelay: 10, // 10ms in event loop break
    breakInterval, // break every 10k iterations
    logger: (method: string, args: unknown[]) => {
      if (typeof method !== 'string' || (!method.startsWith('eth_') && !method.startsWith('msgboard_'))) {
        return
      }
      source.postMessage(JSON.stringify({
        type: 'log',
        log: method,
        args,
      }))
    },
    progress: (work) => {
      source.postMessage(JSON.stringify({
        type: 'progress',
        work,
      }))
    },
  })
  // set a noop interval to keep the service worker from idling and killing itself
  // event loops are fun
  const id = setInterval(() => { }, Number(breakInterval))
  try {
    const work = await worker.doPoW(data.category, data.data)
    if (!work.isValid) {
      // throw it away
      return
    }
    source.postMessage(JSON.stringify({
      type: 'complete',
      work,
    }))
  } finally {
    clearInterval(id)
  }
}
