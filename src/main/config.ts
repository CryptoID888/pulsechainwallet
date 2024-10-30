import { writable } from './store'
import { type Config, defaultConfig } from '$common/config'
import { get } from 'svelte/store'
import type { Key } from '$preload/api'
import _ from 'lodash';
import poolsConfig from '$common/pools-config.json'
import { emit, handle } from './ipc'

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
  emit('config:update', c)
})

handle('config:get', () => {
  return get(config)
})
handle('config:set', (k: Key, value: any) => {
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
    let clone = _.cloneDeep($config)
    const kSplit = Array.isArray(k) ? k : k.split('.')
    const [zeroTh, first, second] = kSplit
    if (zeroTh === 'byChain' && second === 'poolPower') {
      clone = _.set(clone, [zeroTh, first, 'poolByPowerIndex', value], 0)
    }
    return _.set(clone, k, value)
  })
})
