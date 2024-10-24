import { ipcMain, type IpcMainInvokeEvent } from "electron"

export type CancelFn = () => void
export const binding = <T>(
  eventName: string,
  setup: (
    event: IpcMainInvokeEvent,
    respond: (result: T) => void,
    ...args: any[]
  ) => Promise<[any, CancelFn]>,
) => {
  let cancel: CancelFn = () => { }
  ipcMain.handle(eventName, async (event, ...args) => {
    cancel()
    const respond = (result: T) => {
      event.sender.send(eventName, result)
    }
    const [result, cancelFn] = await setup(event, respond, ...args)
    cancel = cancelFn
    return result
  })
}
