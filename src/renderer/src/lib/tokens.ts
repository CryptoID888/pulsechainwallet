import * as viem from 'viem'
import { chains } from './visual-chain'
import weth from '$lib/assets/tokens/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png'
import hex from '$lib/assets/tokens/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39.png'
import pls from '$lib/assets/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png'
import wpls from '$lib/assets/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png'
import plsx from '$lib/assets/tokens/0x95B303987A60C71504D99Aa1b13B4DA07b0790ab.png'
import type { Erc20Token } from '$common/token'
import { derived } from 'svelte/store'
import { chain } from './chain-state'
import pulsechainTestnetV4Logo from '$lib/assets/chains/0x3af.png'

export const whitelistedERC20: Erc20Token[] = [
  {
    chain: chains.mainnet,
    address: viem.zeroAddress,
    metadata: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      logoURI: weth,
    },
  },
  {
    chain: chains.mainnet,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    metadata: {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: weth,
    },
  },
  {
    chain: chains.mainnet,
    address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
    metadata: {
      symbol: 'HEX',
      name: 'Hex',
      decimals: 8,
      logoURI: hex,
    },
  },
  {
    chain: chains.pulsechain,
    address: viem.zeroAddress,
    metadata: {
      symbol: 'PLS',
      name: 'Pulse',
      decimals: 18,
      logoURI: pls,
    },
  },
  {
    chain: chains.pulsechain,
    address: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
    metadata: {
      symbol: 'WPLS',
      name: 'Wrapped Pulse',
      decimals: 18,
      logoURI: wpls,
    },
  },
  {
    chain: chains.pulsechain,
    address: '0x95B303987A60C71504D99Aa1b13B4DA07b0790ab',
    metadata: {
      symbol: 'PLSX',
      name: 'PulseX',
      decimals: 18,
      logoURI: plsx,
    },
  },
  {
    chain: chains.pulsechain,
    address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
    metadata: {
      symbol: 'HEX',
      name: 'Hex',
      decimals: 8,
      logoURI: hex,
    },
  },
  {
    chain: chains.pulsechainTestnetV4,
    address: viem.zeroAddress,
    metadata: {
      symbol: 'V4TPLS',
      name: 'Testnet Pulse',
      decimals: 18,
      logoURI: pulsechainTestnetV4Logo,
    },
  },
  {
    chain: chains.pulsechainTestnetV4,
    address: '0x70499adEBB11Efd915E3b69E700c331778628707',
    metadata: {
      symbol: 'V4TWPLS',
      name: 'Testnet Wrapped Pulse',
      decimals: 18,
      logoURI: pulsechainTestnetV4Logo,
    },
  },
]

export const tokensOnActiveChain = derived([chain], ([$chain]) => {
  return whitelistedERC20.filter((tkn) => +tkn.chain.id === $chain?.id)
})

export const nativeTokenOn = (id: number) => {
  return whitelistedERC20.find(({ address, chain }) => address === viem.zeroAddress && chain.id === id)!
}
