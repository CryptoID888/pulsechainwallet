import { concatBytes, createWalletClient, HDAccount, Hex, hexToBytes, isHex, keccak256, PrivateKeyAccount, SendTransactionParameters, stringToBytes, toHex, type PublicClient } from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import type { NonceData, InsertableWalletMetadata, Phrase, PK, PrivateWalletInfo, WalletMetadata, Account, UpdateableWalletMetadata } from '$common/wallets'
import { transactions, password, query } from '$main/sql'
import { paths, PathTypes } from '$common/path'
import { chainIdToChain, getPublicClient, transportByChain } from '$main/chain';
import { config } from '$main/config'
import { ChainIds } from '$common/config'
import { handle } from '$main/ipc'
import * as safe from '$main/safe'

type Wallet = WalletMetadata & {
  encrypted: Hex
}

const derivePath = (pathType: PathTypes, isPK: boolean, $index: number) => {
  if (isPK) {
    return null
  }
  const deriver = paths.get(pathType || PathTypes.BIP44)
  if (!deriver) {
    return null
  }
  return deriver.path($index)
}

export const walletMetadata = ($wallet: WalletMetadata, index: number) => {
  if (!$wallet) {
    return null
  }
  return {
    type: $wallet.type,
    path_type: $wallet.path_type,
    index,
  } as const
}

const deriveAccountFromSecret = (pathType: PathTypes, wallet: PrivateWalletInfo, index: number): HDAccount | PrivateKeyAccount => {
  if (pathType === PathTypes.UNKNOWN) {
    const pkWallet = wallet as PK
    const account = privateKeyToAccount(pkWallet)
    return account
  }
  const mnemonicWallet = wallet as Phrase
  const account = mnemonicToAccount(mnemonicWallet, {
    path: derivePath(pathType, false, index)!,
  })
  return account
}
const deriveAddressFromSecret = (pathType: PathTypes, wallet: PrivateWalletInfo, index: number) => {
  return deriveAccountFromSecret(pathType, wallet, index).address
}

export const methods = {
  all: async () => {
    return query.all<WalletMetadata>('WALLET_ALL', [])
  },
  add: (secret: Hex | string, pathType: PathTypes) => {
    const isPK = pathType === PathTypes.UNKNOWN
    const pk = secret as Hex
    const phrase = secret as string
    const type = pathType === PathTypes.UNKNOWN ? 'pk' : 'phrase'
    const secretInput = isPK ? concatBytes([
      stringToBytes('pk', { size: 32 }),
      hexToBytes(pk),
    ]) : concatBytes(phrase.split(' ').map((word) => stringToBytes(word, { size: 32 })))
    const id = keccak256(secretInput)
    const encrypted = safe.encrypt(secret)
    const addedSet = new Set([0])
    const indices = isPK ? [0] : new Array(50).fill(0).map((_v, i) => i)
    const accounts = indices.map((i) => ({
      wallet_id: id,
      address: deriveAddressFromSecret(pathType, secret, i),
      address_index: i,
      added: addedSet.has(i),
    }))
    const row: InsertableWalletMetadata = {
      id,
      name: null,
      type,
      path_type: pathType,
      encrypted,
      address_index: 0,
    }
    const count = transactions.addWallet(row, accounts)
    const total = count + 1
    if (count === 0) {
      // if this was the first wallet, then set the config to use it
      config.updatePartial({
        walletId: id,
        addressIndex: 0,
        walletCount: total,
      })
    } else {
      config.updatePartial({
        walletCount: total,
      })
    }
    return row.id
  },
  update: (id: Hex, updates: UpdateableWalletMetadata) => {
    query.run('WALLET_UPDATE', [{ id, name: updates.name }])
    return query.get<WalletMetadata>('WALLET_GET', [{ id }])
  },
  account: async (id: Hex, addressIndex: number) => {
    return query.get<Account>('ACCOUNT_GET', [{
      wallet_id: id,
      address_index: addressIndex,
    }])
  },
  accounts: async () => {
    return query.all<Account>('ACCOUNT_ALL', [])
  },
  accountsUnder: async (id: Hex) => {
    return query.all<Account>('ALL_ACCOUNTS_UNDER', [{ id }])
  },
  reveal: async (pass: string, id: Hex, addressIndex?: number) => {
    if (!(await password.check(pass))) {
      return false
    }
    const $wallet = query.get<Wallet>('WALLET_GET', [{ id }])
    if (!$wallet) {
      return null
    }
    const revealed = safe.decrypt($wallet.encrypted)
    if (addressIndex === undefined) {
      // returning the secret!!!
      return isHex(revealed)
        ? (revealed as PK)
        : (revealed as Phrase)
    }
    // the encrypted secret on the wallet is the only secret we have
    if (isHex(revealed)) {
      return revealed
    }
    // derive the account from the secret and return the private key
    // this path is only reached if
    // 1) the wallet is a phrase
    // 2) the caller has provided an address index
    const hdAccount = deriveAccountFromSecret($wallet.path_type, revealed, addressIndex) as HDAccount
    return toHex(hdAccount.getHdKey().privateKey!, { size: 32 })
  },
  derive: (id: Hex, indices: number[]) => {
    const $wallet = query.get<Wallet>('WALLET_GET', [id])
    if (!$wallet) {
      return []
    }
    return indices.map((i) => deriveAddressFromSecret($wallet.path_type, safe.decrypt($wallet.encrypted), i))
    // return await query.all('ACCOUNT_GET', [walletIndex, indices])
  },
  updateAddedAccounts: async (walletId: Hex, added: number[]) => {
    transactions.nullifyAndSetAdded(walletId, added)
    return added
  },
  sendTransaction: async (chainId: ChainIds, accountInput: Account, input: SendTransactionParameters, action: string) => {
    const seed = await query.get<Wallet>('WALLET_GET', [{ id: accountInput.wallet_id }])
    if (!seed) {
      throw new Error('seed')
    }
    let account = deriveAccountFromSecret(seed.path_type, safe.decrypt(seed.encrypted), accountInput.address_index)
    if ((account as HDAccount).getHdKey) {
      const hdKey = (account as HDAccount).getHdKey()
      const pk = toHex(hdKey.privateKey!, { size: 32 })
      account = privateKeyToAccount(pk)
    }
    if (!account) {
      throw new Error('account')
    }
    if (account.address !== accountInput.address) {
      throw new Error('from')
    }
    const chain = chainIdToChain.get(chainId)!
    const walletClient = createWalletClient({
      account,
      chain,
      transport: transportByChain(chain),
    })
    const hash = await walletClient.sendTransaction(input)
    query.run('CHAIN_TRANSACTION_INSERT', [{
      hash,
      chain_id: chainId,
      action,
    }])
    return hash
  },
  estimateGas: async (chainId: ChainIds, input: SendTransactionParameters) => {
    const chain = chainIdToChain.get(chainId)!
    const client = getPublicClient(chain)
    return client.estimateGas(input)
  },
} as const

handle('wallet:all', methods.all)

handle('wallet:add', methods.add)

handle('wallet:update', methods.update)

handle('wallet:account', methods.account)

handle('wallet:accounts', methods.accounts)

handle('wallet:accountsUnder', methods.accountsUnder)

handle('wallet:reveal', methods.reveal)

handle('wallet:derive', methods.derive)

handle('wallet:updateAddedAccounts', methods.updateAddedAccounts)

handle('wallet:sendTransaction', methods.sendTransaction)

handle('wallet:estimateGas', methods.estimateGas)

handle('wallet:nonces', async (chainId, address) => {
  const chain = chainIdToChain.get(chainId)!
  return noncesFromAddress(getPublicClient(chain), address)
})

export const noncesFromAddress = async ($currentPublicClient: PublicClient, address: Hex) => {
  const [latest, pending] = await Promise.all([
    $currentPublicClient.getTransactionCount({
      blockTag: 'latest',
      address,
    }),
    $currentPublicClient.getTransactionCount({
      blockTag: 'pending',
      address,
    }),
  ])
  return {
    latest,
    pending,
  } as NonceData
}
