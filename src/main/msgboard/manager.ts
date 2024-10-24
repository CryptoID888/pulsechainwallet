import { JsonRpcProvider } from 'ethers'
import * as msgboard from '@pulsechain/msgboard'
import type { ServiceWorkerMessage, MessageData } from '$lib/types'

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
  text: string
  cancel?: typeof cancel
  progress: (work: msgboard.Work) => void
  complete: (work: msgboard.Work) => void
  logger?: (method: string, args: unknown[]) => void
}

export const doWork = async ({
  rpcUrl,
  category,
  text,
  cancel: _cancel = cancel,
  progress,
  complete,
  logger,
}: Options) => {
  let reg!: ServiceWorkerRegistration
  let rejected!: () => void
  let cancelled!: boolean
  const provider = new JsonRpcProvider(rpcUrl)
  const worker = new msgboard.MsgBoard(provider, {
    logger,
  })
  const status = await worker.status()
  const initMsg = JSON.stringify({
    type: 'work',
    rpc: rpcUrl,
    category,
    data: text,
    hardFactor: status.hardFactor.toString(),
    easyFactor: status.easyFactor.toString(),
  } as ServiceWorkerMessage)
  type Message = {
    data: string
  }
  let catchHandler!: (msg: Message) => void
  const unregister = () => {
    navigator.serviceWorker.removeEventListener('message', catchHandler)
  }
  return {
    worker,
    cancel: async () => {
      await _cancel(reg)
      cancelled = true
      unregister()
      rejected()
    },
    start: () =>
      new Promise<ServiceWorker>((resolve, reject) => {
        rejected = reject
        catchHandler = (msg: Message) => {
          try {
            handle(JSON.parse(msg.data))
          } catch (err) {
            console.error(err)
          }
        }
        // navigator.serviceWorker.addEventListener('controllerchange', (e) => {
        //   console.log(e)
        // })
        navigator.serviceWorker.addEventListener('message', catchHandler)
        let active!: ServiceWorker
        console.log(navigator.serviceWorker)
        navigator.serviceWorker.ready
          .then((registration) => {
            reg = registration
            const serviceWorker = registration.active
            console.log('serviceWorker', serviceWorker)
            if (!serviceWorker) {
              reject(new Error('no active service worker'))
            }
            active = serviceWorker!
            active.postMessage(initMsg)
          })
          .catch((err) => {
            console.log(err)
            throw err
          })
        const handle = (msg: MessageData) => {
          let work!: msgboard.Work
          if (cancelled) return
          console.log('handle', msg)
          resolve(active)
          switch (msg.type) {
            // case 'log':
            //   addToList(new Log(msg.log))
            //   break
            case 'progress':
              work = msgboard.Work.fromJSON(msg.progress!)
              // console.log('progress %o over %oms', work.iterations, work.duration)
              // addToList(new Log(`progress ${work.iterations} over ${work.duration}ms`))
              // lastProgress.update(() => work)
              progress(work)
              break
            case 'complete':
              work = msgboard.Work.fromJSON(msg.work!)
              unregister()
              complete(work)
              // addToList(new Log(
              //   `added work ${work.hash} at block ${work.block.number}`,
              // ))
              // noteWork(work)
              break
            default:
              // console.log('unknown event %o', msg.type)
              break
          }
        }
      }),
  }
}
