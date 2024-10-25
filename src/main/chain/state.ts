import { ipcMain } from "electron/main";
import type { Erc20Token } from '$common/token';
import { chainIdToChain, getPublicClient } from ".";
import { getContract, type ChainContract, parseAbi, zeroAddress, parseUnits, Hex, erc20Abi, Block } from "viem";
import { binding } from "$main/handler";
import * as sql from '$main/sql';
import type { ChainTransaction } from '$common/types';
const poolAbi = parseAbi(['function getReserves() view returns((uint112,uint112,uint32))'])
const factoryAbi = parseAbi(['function getPair(address, address) view returns(address)'])

binding<Block>('state:block', async (_, respond, chainId: number) => {
  const chain = chainIdToChain.get(chainId)!
  const client = getPublicClient(chain)
  const cancel = client.watchBlocks({
    emitOnBegin: false,
    onBlock: respond,
  })
  const block = await client.getBlock({
    blockTag: 'latest',
  })
  return [block, cancel]
})

ipcMain.handle('state:transaction:wait', async (_event, chainId: number, hash: Hex) => {
  const chain = chainIdToChain.get(chainId)!
  const client = getPublicClient(chain)
  return await client.waitForTransactionReceipt({ hash })
})

ipcMain.handle('state:transactions', async (_event) => {
  return sql.query.all<ChainTransaction>('ALL_TRANSACTIONS', [])
})

ipcMain.handle('state:transaction:data', async (_event, chainId: number, hash: Hex) => {
  const chain = chainIdToChain.get(+chainId)!
  const client = getPublicClient(chain)
  let block: Block | null = null
  const [transaction, receipt] = await Promise.all([
    client.getTransaction({
      hash,
    }),
    client.getTransactionReceipt({
      hash,
    }),
  ])
  if (receipt) {
    block = await client.getBlock({
      blockNumber: receipt.blockNumber,
    })
  }
  return {
    transaction,
    receipt,
    block,
  }
})

ipcMain.handle('state:transaction', async (_event, chainId: number, hash: Hex) => {
  const chain = chainIdToChain.get(chainId)!
  const client = getPublicClient(chain)
  return client.getTransaction({ hash })
})

ipcMain.handle('wallet:balance', async (_event, chainId: number, address: Hex, token: Erc20Token) => {
  const chain = chainIdToChain.get(chainId)!
  const client = getPublicClient(chain)
  if (token.address === zeroAddress) {
    return await client.getBalance({
      address,
    })
  }
  const contract = getContract({
    abi: erc20Abi,
    address: token.address,
    client,
  })
  return await contract.read.balanceOf([address])
})

ipcMain.handle('state:price', async (_event, token: Erc20Token, blockNumber: string = 'latest') => {
  const chain = chainIdToChain.get(Number(token.chain.id))!
  const client = getPublicClient(chain)

  const wrappedNative = chain.contracts!.wrappedNative as ChainContract
  const uniswapV2Factory = chain.contracts!.uniswapV2Factory as ChainContract
  const dai = chain.contracts!.dai as ChainContract
  const decimals = token.metadata!.decimals
  const factory = getContract({
    abi: factoryAbi,
    client,
    address: uniswapV2Factory.address,
  })
  let tokenAddress = token.address
  if (tokenAddress === zeroAddress) {
    tokenAddress = wrappedNative.address
  }
  const daiAddress = dai.address
  const pair = await factory.read.getPair([tokenAddress, daiAddress])
  const pool = getContract({
    abi: poolAbi,
    address: pair,
    client,
  })
  const reserves = await pool.read
    .getReserves(blockNumber === 'latest' ? {
      blockTag: 'latest',
    } : {
      blockNumber: BigInt(blockNumber),
    })
    .catch(() => null)
  if (!reserves) {
    return
  }
  const tokenIndex = tokenAddress.toLowerCase() < daiAddress.toLowerCase() ? 0 : 1
  const daiIndex = Number(!tokenIndex)
  const tokenReserve = BigInt(reserves[tokenIndex])
  const daiReserve = BigInt(reserves[daiIndex])
  return (daiReserve * parseUnits('1', decimals)) / tokenReserve
})
