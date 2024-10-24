import { ipcMain } from 'electron'
import { chainIdToChain, getPublicClient } from './chain'
import { Hex } from 'viem'

export const getEnsAddress = async (chainId: number, name: string) => {
  const chain = chainIdToChain.get(chainId)
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`)
  }
  const client = getPublicClient(chain)
  return client.getEnsAddress({
    name,
  })
}

export const getEns = async (chainId: number, address: Hex) => {
  const chain = chainIdToChain.get(chainId)
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`)
  }
  const client = getPublicClient(chain)
  return client.getEnsName({
    address,
  })
}

ipcMain.handle('ens:getEnsAddress', async (_event, chainId: number, name: string) => {
  return await getEnsAddress(chainId, name)
})
ipcMain.handle('ens:getEns', async (_event, chainId: number, address: Hex) => {
  return await getEns(chainId, address)
})
