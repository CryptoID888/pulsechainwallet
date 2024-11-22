import { readable } from '$lib/event-store'
import { push as goto } from 'svelte-spa-router'
import type { Account, NonceData, UpdateableWalletMetadata, WalletMetadata } from '$common/wallets'
import { derived, get, type Stores } from 'svelte/store'
import { config } from '$lib/config'
import type { Hex } from 'viem'
import { PathTypes } from '$common/path'
import { chain, currentBlock } from './chain-state'
import * as api from '$lib/api'
import type { ChainIds } from '$common/config'
/**
 * the wallets that should be available to the app
 * this is a read only store, so we only pass the event that we want to listen to
 */
export const wallets = readable<WalletMetadata[]>(
  'wallets',
  () => {
    return api.wallet.all()
  },
  [],
)

export const isLoggedIn = derived([wallets], ([$wallets]) => {
  return $wallets && $wallets.length > 0
})

export const updateWallet = (index: Hex, updates: UpdateableWalletMetadata) => {
  api.wallet.update(index, updates)
}

export const walletAccountsUnder = (id: Hex) => {
  return api.wallet.accountsUnder(id)
}

export const accounts = readable<Account[]>(
  'accounts',
  () => {
    return api.wallet.accounts()
  },
  [],
)

export const currentAccount = derived([accounts, config], ([$accounts, $config]) => {
  return (
    $accounts.find(
      ($account) => $account.wallet_id === $config.walletId && $account.address_index === $config.addressIndex,
    ) ?? null
  )
})

export const accountsUnder = derived([accounts, config], ([$accounts, $config]) => {
  return $accounts.filter(($account) => $account.wallet_id === $config.walletId)
})

export const addedAccounts = derived([accounts], ([$accounts]) => {
  return $accounts.filter(($account) => $account.added)
})

export const addedAccountsUnder = derived([addedAccounts, config], ([$addedAccounts, $config]) => {
  return $addedAccounts.filter(($account) => $account.wallet_id === $config.walletId && $account.added)
})

export const addedAccountsByWalletId = derived([addedAccounts], ([$accounts]) => {
  return $accounts.reduce(
    (acc, curr) => {
      const list = acc[curr.wallet_id] || []
      list.push(curr)
      acc[curr.wallet_id] = list
      return acc
    },
    {} as Record<Hex, Account[]>,
  )
})

export const revealSecret = async (pass: string, walletId: Hex, addressIndex?: number) => {
  return api.wallet.reveal(pass, walletId, addressIndex)
}

export const hasWallets = derived([config], ([$config]) => $config.walletCount)

export const accountFrom = async (walletId: Hex, addressIndex: number) => {
  return await api.wallet.account(walletId, addressIndex)
}

export const deriveAddresses = async (id: Hex, indices: number[]) => {
  return (await api.wallet.derive(id, indices)) as Hex[]
}

export const addWalletUnderCurrent = async (value: Hex | string) => {
  return await api.wallet.add(value, PathTypes.UNKNOWN)
}

export const nonces = derived<Stores, NonceData>([chain, currentAccount, currentBlock], ([$chain, $account], set) => {
  api.wallet.nonces($chain.id, $account.address).then(set)
})

export const commitmentFromAccountSignature = async (account: Account, chainId: ChainIds, $poolAddress: Hex) => {
  return await api.pool.commitmentFromAccountSignature(account, chainId, $poolAddress)
}

export const checkWallets = () => {
  if (!get(wallets)) {
    setTimeout(() => {
      if (get(wallets)) return
      console.log('check wallets failed')
      goto('/locked')
    }, 1_000)
  }
}
