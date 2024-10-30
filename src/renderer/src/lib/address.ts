import { getAddress, type Hex } from 'viem'
import { get } from 'svelte/store'

import { settings } from '$lib/settings'
import { emptyHex } from '$common/config'

export const truncatedAddress = (address: Hex, count = get(settings).addressTruncation) =>
  count === 20 ? address : `${address.slice(0, 2 + count)}...${address.slice(-count)}`

export const defaultAddress = getAddress(emptyHex + 'deadbeef'.repeat(5))
