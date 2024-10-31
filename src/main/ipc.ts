import type { API, DirectHandler } from '$common/api'
import { ipcMain } from 'electron'
import { main } from '$main/window'
import { get } from 'svelte/store'

export const handle = <K extends keyof API>(k: K, fn: DirectHandler<K>) =>
  ipcMain.handle(k, (_event, ...params: Parameters<API[K]>) => fn(...params))

export const emit = (k: string, ...params: unknown[]) => {
  const $main = get(main)
  if (!$main || $main?.isDestroyed()) return
  $main?.webContents?.send(k, ...params)
}
