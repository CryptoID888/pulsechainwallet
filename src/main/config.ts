import { writable } from './store'
import { type Config, defaultConfig } from '$common/config'
import { get } from 'svelte/store'
import { ipcMain } from 'electron'
import type { Key } from '$preload/api'
import _ from 'lodash';
import poolsConfig from '$common/pools-config.json'
import { main } from './window'

/**
 * The config store
 * creates a store that will emit config:update events when the config is updated
 * it will also save the config to disk at config.json
 * and it will backfill configuration during first load
 */
export const config = writable<Config>('config', defaultConfig, (current) => {
  // backfill pools config if missing
  for (const chainId of Object.keys(current.byChain)) {
    current.byChain[chainId].pools = current.byChain[chainId].pools || poolsConfig[chainId]
  }
  return current
})
config.subscribe((c) => {
  get(main)?.webContents.send('config:update', c)
})

ipcMain.handle('config:get', () => {
  return get(config)
})
ipcMain.handle('config:set', (_event, k: Key, value: any) => {
  if (k === null) {
    return
  }
  config.update(($config) => {
    if (k === '.') {
      return {
        ...$config,
        ...value,
      }
    }
    return _.set(_.cloneDeep($config), k, value)
  })
})
