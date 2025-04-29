import { JsonRpcProvider } from 'ethers'
import * as msgboard from '@pulsechain/msgboard'

import nodeWorker from '$main/worker?nodeWorker'
import type { ServiceWorkerMessage } from '$common/types'
import type { ChainIds } from '$common/config'

export const cancel = async (reg: ServiceWorkerRegistration) => {
  reg.active?.postMessage(
    JSON.stringify({
      type: 'cancel',
    }),
  )
}

type Options = {
  rpcUrl: string
  category: string
  chainId: ChainIds
  text: string
  cancel?: typeof cancel
  progress: (work: msgboard.Message) => void
  complete: (work: msgboard.Message) => void
  logger?: (method: string, args: unknown[]) => void
}

export const doWork = async ({
  rpcUrl,
  category,
  chainId,
  text,
  cancel: _cancel = cancel,
  progress,
  logger,
  complete,
}: Options) => {
  let reg!: ServiceWorkerRegistration
  let rejected!: () => void
  let cancelled!: boolean
  const provider = new JsonRpcProvider(rpcUrl)
  const board = new msgboard.MsgBoardClient(provider, {
    logger,
  })
  const status = await board.status()
  const initMsg = {
    type: 'work',
    rpc: rpcUrl,
    category,
    chainId,
    data: text,
    workMultiplier: status.workMultiplier.toString(),
    workDivisor: status.workDivisor.toString(),
  } as ServiceWorkerMessage
  return {
    board,
    cancel: async () => {
      await _cancel(reg)
      cancelled = true
      rejected()
    },
    start: async () => {
      const worker = nodeWorker({
        workerData: initMsg,
      })
      const eventHandlers = {
        logger: (a: { log: string; args: unknown[] }) => {
          logger?.(a.log, a.args)
        },
        progress: (res: msgboard.WorkResult) => {
          if (cancelled) {
            return
          }
          progress(res.message)
        },
        complete: (res: msgboard.WorkResult) => {
          if (cancelled) {
            return
          }
          complete(res.message)
        },
      } as const
      worker.on('message', (msg) => {
        const { type, work } = msg as {
          type: 'logger' | 'progress' | 'complete'
          work: msgboard.WorkResult
        }
        if (type === 'logger') {
          return eventHandlers.logger(work as unknown as Parameters<typeof eventHandlers.logger>[0])
        }
        eventHandlers[type]?.(work)
      })
      worker.postMessage(initMsg)
      return worker
    },
  }
}
