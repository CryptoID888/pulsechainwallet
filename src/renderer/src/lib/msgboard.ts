import * as api from '$lib/api';
import { derived } from '$lib/event-store'
import { config } from '$lib/config';

// export const contents = derived('contents', [config], ([$config]) => (
//   api.msgboard.contents($config.chainId)
// ), [])

// export const pools = derived('pools', [config], ([$config]) => (
//   api.pool.allUnderChain($config.chainId)
// ), [])

export const msgboardPoolContents = derived('msgboardPoolContents', [config], ([$config]) => (
  api.msgboard.poolContents($config.chainId)
), {
  messages: [],
  pools: [],
})
