import { type Hex } from 'viem';

export enum Strategy {
  OLDEST_FIRST = 'oldest-first',
  RECENT_FIRST = 'recent-first',
  RANDOM = 'random',
}

export const native: Hex = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const allPossiblePowers = (new Array(79)).fill(0).map((_v, i) => BigInt(i))
