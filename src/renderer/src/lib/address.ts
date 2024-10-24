import { get } from 'svelte/store'
import { settings } from './settings'
import { getAddress, type Hex } from 'viem'
export const truncatedAddress = (address: Hex, count = get(settings).addressTruncation) =>
  count === 20 ? address : `${address.slice(0, 2 + count)}...${address.slice(-count)}`

export const defaultAddress = getAddress('0x' + 'deadbeef'.repeat(5))
