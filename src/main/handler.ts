import { API, HandlerFn } from '$common/api'
import { ipcMain, type IpcMainInvokeEvent } from 'electron'

export type CancelFn = () => void
export const binding = <K extends keyof API>(
  eventName: K,
  setup: (
    event: IpcMainInvokeEvent,
    respond: (result: ReturnType<API[K]>) => void,
    ...args: Parameters<API[K]>
  ) => Promise<[ReturnType<API[K]>, CancelFn]>,
) => {
  let cancel: CancelFn = () => {}
  const handler: HandlerFn<K> = async (event, ...args: Parameters<API[K]>) => {
    cancel()
    const respond = (result: ReturnType<API[K]>) => {
      event.sender.send(eventName, result)
    }
    const [result, cancelFn] = await setup(event, respond, ...args)
    cancel = cancelFn
    return result
  }
  ipcMain.handle(eventName, handler)
}
