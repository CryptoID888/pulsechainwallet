import { chainIdToChain, getPublicClient } from './chain'
import { Hex } from 'viem'
import { ChainIds } from '$common/config'
import { handle } from './ipc'

export const getEnsAddress = async (chainId: ChainIds, name: string) => {
  const chain = chainIdToChain.get(chainId)
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`)
  }
  const client = getPublicClient(chain)
  return client.getEnsAddress({
    name,
  })
}

export const getEns = async (chainId: ChainIds, address: Hex) => {
  const chain = chainIdToChain.get(chainId)
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`)
  }
  const client = getPublicClient(chain)
  return client.getEnsName({
    address,
  })
}

handle('ens:getEnsAddress', getEnsAddress)
handle('ens:getEns', getEns)
