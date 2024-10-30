import * as viem from 'viem'
import * as viemChains from '$common/chains'
import type { ChainIds } from '$common/config'

export const chainIdToChain = new Map<ChainIds, viem.Chain>(
  Object.values(viemChains).map((chain) => {
    if (chain.id === 1) {
      return {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: {
            ...chain.rpcUrls.default,
            http: ['https://rpc-ethereum.g4mm4.io'],
          },
        },
        contracts: {
          ...chain.contracts,
          dai: {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          },
          uniswapV2Factory: {
            address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
          },
          wrappedNative: {
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          },
        },
      }
    }
    if (chain.id === 369) {
      return {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: {
            ...chain.rpcUrls.default,
            http: [...chain.rpcUrls.default.http],
          },
        },
        contracts: {
          ...chain.contracts,
          ensRegistry: {
            address: '0xbd5133993FCDED5945c5539D9f032261F0d13170',
          },
          ensUniversalResolver: {
            address: '0x6644e794F5aFfb8abcfea0e71d5624D013BA2dBA',
            blockCreated: 19_400_582,
          },
          dai: {
            address: '0xefD766cCb38EaF1dfd701853BFCe31359239F305',
          },
          uniswapV2Factory: {
            address: '0x1715a3E4A142d8b698131108995174F37aEBA10D',
          },
          wrappedNative: {
            address: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
          },
        },
      } as viem.Chain
    }
    if (chain.id === 943) {
      return {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: {
            ...chain.rpcUrls.default,
            http: [...chain.rpcUrls.default.http],
          },
        },
        contracts: {
          ...chain.contracts,
          dai: {
            address: '0x826e4e896CC2f5B371Cd7Bb0bd929DB3e3DB67c0',
          },
          uniswapV2Factory: {
            address: '0xff0538782d122d3112f75dc7121f61562261c0f7',
          },
          wrappedNative: {
            address: '0x70499adEBB11Efd915E3b69E700c331778628707',
          },
          ensRegistry: {
            address: '0xaDB38309aF7F85034FDC35bd6E6B45d1216CfB56',
          },
          ensUniversalResolver: {
            address: '0xE35059d08fA35d42bb8f397F5BD6DCBAa8F37832',
            blockCreated: 18_358_186,
          },
        },
      } as viem.Chain
    }
    return null
  }).filter((entry) => !!entry)
    .map((chain) => [chain.id as ChainIds, chain]),
)

export const selectedChains = {
  ethereum: chainIdToChain.get(1)!,
  pulsechain: chainIdToChain.get(369)!,
  pulsechainV4: chainIdToChain.get(943)!,
} as const

export const chains = Object.values(selectedChains)

export const transportByChain = (chain: viem.Chain) => {
  return viem.fallback([
    ...chain.rpcUrls.default.http.map((url) => viem.http(url)),
    ...(chain.rpcUrls.default.webSocket?.map((url) => viem.webSocket(url)) || []),
  ])
}

/** caches clients so only one is created. retry logic exists in viem */
const clients = new Map<string, viem.PublicClient>()

/** get a public client given a chain */
export const getPublicClient = ($chain: viem.Chain): viem.PublicClient => {
  const transports: viem.Transport[] = []
  // const wsUrls = $chain.rpcUrls.default.webSocket || []
  const httpUrls = $chain.rpcUrls.default.http || []
  const key = `${$chain.id}.${([] as string[])
    .concat(
      // wsUrls,
      httpUrls,
    )
    .join(',')}`
  let client = clients.get(key)
  if (client) return client
  // for (const wsUrl of wsUrls) {
  //   transports.push(viem.webSocket(wsUrl))
  // }
  for (const httpUrl of httpUrls) {
    transports.push(
      viem.http(httpUrl, {
        batch: true,
      }),
    )
  }
  client = viem.createPublicClient({
    chain: $chain,
    transport: viem.fallback(transports, {
      rank: true,
      retryDelay: 500,
    }),
  })
  clients.set(key, client)
  return client
}
