import { writable } from '$lib/event-store'
import { defaultConfig, type Config } from '$common/config'
import { get } from 'svelte/store'
import * as api from '$lib/api'

export const config = writable<Config>(
  'config:update',
  () => api.config.get(),
  async (k, value) => {
    if (!k) return
    return await api.config.set(k, value)
  },
  defaultConfig,
)

// export const settings = derived([config], ([$config]) => $config.broadcast)

export const updatePower = (power: number) => {
  const $config = get(config)
  if (!$config) return
  return config.updatePartial(`byChain.${$config.chainId}.poolPower`, power)
}
