import { Phrase, PK, PrivateWalletInfo, WalletMetadata, type Account, type UpdateableWalletMetadata } from '$common/wallets'
import { ipcMain, safeStorage } from 'electron'
import { addWallet, password, nullifyAndSetAdded, query } from './sql'
import { Chain, concatBytes, createWalletClient, fromHex, HDAccount, Hex, hexToBytes, isHex, keccak256, numberToHex, PrivateKeyAccount, SendTransactionParameters, stringToBytes, toHex, type PublicClient } from 'viem'
import { paths, PathTypes } from '$common/path'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { chainIdToChain, getPublicClient, transportByChain } from './chain';
import { config } from './config'
import * as pools from './resources/pools-ts'
import { BigNumberish } from '@ethersproject/bignumber'

type Wallet = WalletMetadata & {
  encrypted: Hex
}

const derivePath = (pathType: PathTypes, isPK: boolean, $index: number) => {
  if (isPK) {
    return null
  }
  const deriver = paths.get(pathType || PathTypes.BIP44)
  console.log('deriver', deriver)
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
  console.log(derivePath(pathType, false, index)!)
  const account = mnemonicToAccount(mnemonicWallet, {
    path: derivePath(pathType, false, index)!,
  })
  return account
}
const deriveAddressFromSecret = (pathType: PathTypes, wallet: PrivateWalletInfo, index: number) => {
  return deriveAccountFromSecret(pathType, wallet, index).address
}

// wraps the secret in an object so that the keys can
// help differentate between pk and phrase
const safe = {
  encrypt: (secret: PrivateWalletInfo) => {
    return toHex(safeStorage.encryptString(secret))
  },
  decrypt: (secret: Hex) => {
    return safeStorage.decryptString(Buffer.from(fromHex(secret, {
      to: 'bytes',
    })))
  },
}

export const methods = {
  all: async () => {
    return await query.all('WALLET_ALL', [])
  },
  add: async (secret: Hex | string, pathType: PathTypes) => {
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
      name: '',
      added: addedSet.has(i),
    }))
    const row: Wallet = {
      id,
      name: null,
      type,
      path_type: pathType,
      encrypted,
      user_order: 0,
      address_index: 0,
    }
    const tx = addWallet()
    const count = await tx(row, accounts)
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
  update: async (id: Hex, updates: UpdateableWalletMetadata) => {
    await query.run('WALLET_UPDATE', [id, updates.name])
    return query.get<WalletMetadata>('WALLET_GET', [{ id }])
  },
  account: async (id: Hex, addressIndex: number) => {
    return await query.get<Account>('ACCOUNT_GET', [{
      wallet_id: id,
      address_index: addressIndex,
    }])
  },
  accounts: async () => {
    return await query.all<Account>('ACCOUNT_ALL', [])
  },
  accountsUnder: async (id: Hex) => {
    return await query.all<Account>('ALL_ACCOUNTS_UNDER', [{ id }])
  },
  reveal: async (pass: string, id: Hex, addressIndex?: number) => {
    if (!(await password.check(pass))) {
      throw new Error('Invalid password')
    }
    const $wallet = await query.get<Wallet>('WALLET_GET', [{ id }])
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
  derive: async (id: Hex, indices: number[]) => {
    const $wallet = await query.get<Wallet>('WALLET_GET', [id])
    if (!$wallet) {
      return []
    }
    return indices.map((i) => deriveAddressFromSecret($wallet.path_type, safe.decrypt($wallet.encrypted), i))
    // return await query.all('ACCOUNT_GET', [walletIndex, indices])
  },
  updateAddedAccounts: async (walletId: Hex, added: number[]) => {
    await nullifyAndSetAdded()(walletId, added)
  },

  sendTransaction: async (chainId: number, accountInput: Account, input: SendTransactionParameters, action: string) => {
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
    await query.run('CHAIN_TRANSACTION_INSERT', [{
      hash,
      chain_id: chainId,
      action,
    }])
    return hash
  },
  // secretFromAccountSignature: async (account: Account, chain: Chain, poolAddress: Hex) => {
  //   return secretFromAccountSignature(account, chain, poolAddress)
  // },
  commitmentFromAccountSignature: async (account: Account, chain: Chain, poolAddress: Hex) => {
    return commitmentFromAccountSignature(account, chain, poolAddress)
  },
  estimateGas: async (chainId: number, input: SendTransactionParameters) => {
    const chain = chainIdToChain.get(chainId)!
    const client = getPublicClient(chain)
    return client.estimateGas(input)
  },
} as const

ipcMain.handle('wallet:all', async (_event) => {
  return await methods.all()
})

ipcMain.handle('wallet:add', async (_event, secret: Hex | string, pathType: PathTypes) => {
  return await methods.add(secret, pathType)
})

ipcMain.handle('wallet:update', async (_event, id: Hex, updates: UpdateableWalletMetadata) => {
  return await methods.update(id, updates)
})

ipcMain.handle('wallet:account', async (_event, id: Hex, addressIndex: number) => {
  return await methods.account(id, addressIndex)
})

ipcMain.handle('wallet:accounts', async (_event) => {
  return await methods.accounts()
})

ipcMain.handle('wallet:accountsUnder', async (_event, id: Hex) => {
  return await methods.accountsUnder(id)
})

ipcMain.handle('wallet:reveal', async (_event, pass: string, id: Hex, index?: number) => {
  return await methods.reveal(pass, id, index)
})

ipcMain.handle('wallet:derive', async (_event, id: Hex, indices: number[]) => {
  return await methods.derive(id, indices)
})

ipcMain.handle('wallet:updateAddedAccounts', async (_event, walletId: Hex, added: number[]) => {
  return await methods.updateAddedAccounts(walletId, added)
})

ipcMain.handle('wallet:sendTransaction', async (_event, chainId: number, account: Account, input: SendTransactionParameters, action: string) => {
  return await methods.sendTransaction(chainId, account, input, action)
})

// ipcMain.handle('wallet:secretFromAccountSignature', async (_event, account: Account, chain: Chain, poolAddress: Hex) => {
//   return await methods.secretFromAccountSignature(account, chain, poolAddress)
// })

ipcMain.handle('wallet:estimateGas', async (_event, chainId: number, input: SendTransactionParameters) => {
  return await methods.estimateGas(chainId, input)
})

ipcMain.handle('wallet:holdPasswordIfCorrect', async (_event, pass: string) => {
  return await password.check(pass)
})

ipcMain.handle('wallet:commitmentFromAccountSignature', async (_event, account: Account, chain: Chain, poolAddress: Hex) => {
  return await methods.commitmentFromAccountSignature(account, chain, poolAddress)
})

type ChainState = {
  latest: number
  pending: number
}

// export const nonces = derived<
//   Stores,
//   ChainState | null
// >(
//   // current block used as a clock tick
//   [currentBlock, currentPublicClient, config],
//   ([$currentBlock, $currentPublicClient, $config], set) => {
//     if (!$currentBlock || isNil($config.addressIndex) || !$currentPublicClient) {
//       set(null)
//       return
//     }
//     query.get<Account>('ACCOUNT_GET', [$config.walletId, $config.addressIndex])
//       .then(async (account) => {
//         if (!account?.address) {
//           set(null)
//           return
//         }
//         set(await noncesFromAddress($currentPublicClient, account?.address))
//       })
//   },
// )

// // this should probably go into a store by itself
// derived([nonces], ([$nonces]) => {
//   ipcMain.emit('nonces', $nonces)
//   return $nonces
// })

ipcMain.handle('wallet:nonces', async (_event, chainId: number, address: Hex) => {
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
  } as ChainState
}

export const secretFromAccountSignature = async (account: Account, $chain: Chain, $poolAddress: Hex) => {
  const wallet = await query.get<Wallet>('WALLET_GET', [{ id: account.wallet_id }])
  if (!wallet) {
    return null
  }

  const $account = deriveAccountFromSecret(wallet.path_type, safe.decrypt(wallet.encrypted), account.address_index)
  if (!$account) {
    return null
  }
  const signature = await $account.signTypedData({
    primaryType: 'ShieldInput',
    types: {
      ShieldInput: [
        {
          name: 'sender',
          type: 'address',
        },
        {
          name: 'pool',
          type: 'address',
        },
      ],
    },
    domain: {
      name: 'Shield',
      version: '1',
      verifyingContract: $poolAddress,
      chainId: $chain.id,
    },
    message: {
      sender: account.address,
      pool: $poolAddress,
    },
  })
  const pk = keccak256(signature)
  return pools.toFE(pk)
}

export const commitmentFromAccountSignature = async (account: Account, $chain: Chain, $poolAddress: Hex) => {
  const secret = await secretFromAccountSignature(account, $chain, $poolAddress)
  if (!secret) {
    return null
  }
  return secretToCommitment(secret!)
}

export const secretToCommitment = (secret: BigNumberish) => {
  const commitment = pools.poseidon([secret])
  return numberToHex(BigInt(commitment.toString()), { size: 32 })
}

// import { paths, PathTypes, type Path } from '$common/path'
// import { derived, get, writable, type Readable, type Writable } from 'svelte/store'
// import {
//   bytesToHex,
//   createWalletClient,
//   isHex,
//   keccak256,
//   numberToHex,
//   stringToHex,
//   type Block,
//   type Chain,
//   type Hex,
//   type PublicClient,
//   type SendTransactionParameters,
// } from 'viem'
// import { chain, currentBlock, currentPublicClient, transportByChain } from './chain-state'
// import { navigate as goto } from 'svelte-routing'
// import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
// import * as ethers from 'ethers'
// import _ from 'lodash'
// import { contactByAddress } from './contacts'
// import * as pools from '../../../../resources/pools/pools-ts'
// import type { BigNumberish } from '@ethersproject/bignumber'
// import { status } from '../renderer/src/bakup-lib/ponder/index';

// const STORAGE_KEY = 'wallets'

// type W = ethers.HDNodeWallet | ethers.Wallet

// export type WalletMetadata = {
//   indices: number[]
//   added: number[]
//   pathType: PathTypes
//   name?: string
//   index: number
//   type: SeedType
// }

// type Wallet<W> = WalletMetadata & {
//   wallet: W
// }

// type ParsedEncrypted = { [key: string]: unknown }

// export type Encrypted = Wallet<ParsedEncrypted>
// export type Decrypted = Wallet<W>

// const pw = persisted<Encrypted[]>(STORAGE_KEY, [], {
//   storage: 'local',
//   serializer: {
//     stringify: JSON.stringify,
//     parse: (val: string) => {
//       const p = JSON.parse(val)
//       return p
//     },
//   },
// })

// const persistedWallets = {
//   ...pw,
//   push: (encrypted: Encrypted) => {
//     pw.update(($pw) =>
//       _.uniqBy(
//         $pw.concat({
//           ...encrypted,
//         }),
//         ($e) => $e.wallet.address,
//       ),
//     )
//   },
//   updateOne: ($wallet: Wallet<unknown>, metadata: Partial<WalletMetadata>) => {
//     pw.update(($pw) =>
//       $pw.map(($w) =>
//         $w !== $wallet
//           ? $w
//           : {
//             ...$w,
//             ...metadata,
//           },
//       ),
//     )
//   },
// }

// export const updateWallet = (index: number, updates: Partial<WalletMetadata>) => {
//   const $wallets = get(persistedWallets)
//   const $wallet = $wallets[index]
//   // console.log($wallet, updates)
//   persistedWallets.updateOne($wallet, updates)
// }

// export const walletCount = derived([persistedWallets], ([$persistedWallets]) => {
//   return $persistedWallets.length
// })

// const password = persisted<string | null>('password', null, {
//   storage: 'local',
// })

// const isDevMode = writable(true)

// const wipeUnsafe = () => {
//   if (get(isDevMode)) {
//     let k!: null | string
//     let i = 0
//     while ((k = localStorage.key(i))) {
//       if (k.startsWith('unsafe')) {
//         localStorage.removeItem(k)
//       }
//       i++
//     }
//   }
// }

// wipeUnsafe()

// const unsafeStorageKey = (encrypted: Encrypted) => {
//   const hash = keccak256(stringToHex(JSON.stringify(encrypted.wallet)))
//   return `unsafe-decrypted:${hash}`
// }

// const decrypt = async ($w: Encrypted, index: number, $password: string): Promise<Decrypted> => {
//   let wallet!: ethers.HDNodeWallet | ethers.Wallet
//   const data = {
//     indices: $w.indices,
//     added: $w.added,
//     pathType: $w.pathType,
//   }
//   let type = 'pk' as SeedType
//   if (get(isDevMode)) {
//     const key = unsafeStorageKey($w)
//     const item = localStorage.getItem(key)
//     if (item) {
//       if (isHex(item)) {
//         wallet = new ethers.Wallet(item)
//       } else {
//         wallet = ethers.Wallet.fromPhrase(item)
//         type = 'phrase'
//       }
//       return {
//         ...data,
//         wallet,
//         type,
//         index,
//       }
//     }
//   }
//   const keystore = await ethers.decryptKeystoreJson(JSON.stringify($w.wallet), $password!)
//   const { mnemonic, privateKey } = keystore
//   if (keystore.mnemonic) {
//     wallet = ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromEntropy(mnemonic!.entropy, $password))
//     if (get(isDevMode)) {
//       const key = unsafeStorageKey($w)
//       localStorage.setItem(key, wallet.mnemonic!.phrase)
//     }
//     type = 'phrase'
//   } else if (privateKey) {
//     wallet = new ethers.Wallet(privateKey)
//     if (get(isDevMode)) {
//       const key = unsafeStorageKey($w)
//       localStorage.setItem(key, wallet.privateKey)
//     }
//   }
//   return {
//     ...data,
//     wallet,
//     type,
//     index,
//   }
// }

// const wallets = derived(
//   [persistedWallets, password],
//   ([$wallets, $password], set) => {
//     if (!$password) {
//       set([])
//       return
//     }

//     loading.increment('decrypt')
//     Promise.all($wallets.map(($e, i) => decrypt($e, i, $password)))
//       .then(
//         ($w) => {
//           set($w)
//         },
//         (e) => {
//           console.log(e)
//           set([])
//         },
//       )
//       .then(() => {
//         loading.decrement('decrypt')
//       })
//   },
//   [] as Decrypted[],
// )

// export const isLoggedIn = derived(
//   [password, wallets],
//   ([$password, $wallets]) =>
//     // validation can be used downstream
//     !!$password && $password.length > 0 && !!$wallets.length,
// )

// export const secretsMetadata = derived([persistedWallets], ([$wallets]) =>
//   $wallets.map(($wallet, i) => walletMetadata($wallet, i)!),
// )

// const localNumber = {
//   storage: 'local' as const,
//   serializer: {
//     stringify: (val: number) => `${val}`,
//     parse: (val: string) => +val,
//   },
// }

// export const currentWalletIndex = persisted<number>('walletIndex', 0, localNumber)

// export const currentAddressIndex = persisted<number>('addressIndex', 0, localNumber)

// export const hasWallets = derived([persistedWallets], ([$persistedWallets]) => {
//   return $persistedWallets && $persistedWallets.length > 0
// })

// export const wallet = derived([wallets, currentWalletIndex], ([$wallets, $currentWalletIndex]) => {
//   return $wallets[$currentWalletIndex] || null
// })

// export const path = derived([wallet, currentAddressIndex], ([$wallet, $index]) => {
//   return derivePath($wallet, $index)
// })

// const derivePath = ($wallet: Decrypted, $index: number) => {
//   if (!$wallet) {
//     return null
//   }
//   if (typeof $wallet === 'string') {
//     return null
//   }
//   const eMnemonic = $wallet.wallet as ethers.HDNodeWallet
//   if (!eMnemonic.mnemonic) {
//     // private key - no derivation to occur
//     return null
//   }
//   const deriver = paths.get($wallet.pathType || PathTypes.BIP44)
//   if (!deriver) {
//     return null
//   }
//   return deriver.path($index)
// }

// const currentAccount = ($path: Path, $wallet: Decrypted, $currentAddressIndex: number) => {
//   if ($currentAddressIndex < 0 || !$wallet) {
//     return null
//   }
//   const w = $wallet.wallet as ethers.HDNodeWallet
//   if (w.mnemonic) {
//     if (!$path) return null
//     const account = mnemonicToAccount(w.mnemonic.phrase, {
//       path: $path,
//     })
//     return account
//   }
//   const pkWallet = $wallet.wallet as ethers.Wallet
//   const account = privateKeyToAccount(pkWallet.privateKey as Hex)
//   return account
// }

// export const currentAddress = derived([path, wallet, currentAddressIndex], ([$path, $wallet, $currentAddressIndex]) => {
//   if ($currentAddressIndex === -1 || !$wallet || !$path) {
//     return null
//   }
//   const wallet = currentAccount($path, $wallet, $currentAddressIndex)
//   if (!wallet) {
//     return null
//   }
//   return wallet.address
// })

// export type SeedType = 'phrase' | 'pk' | 'read-only'

// export type Account = {
//   address: Hex
//   index: number
//   name: string
//   seed: WalletMetadata
// }

// /**
//  * public facing data around the
//  */
// export const account = derived(
//   [currentAddressIndex, currentWalletIndex, wallet],
//   ([$addressIndex, $currentWalletIndex]) => {
//     return accountFromIndices($currentWalletIndex, $addressIndex)
//   },
// )

// export const accountFromIndices = (
//   walletIndex: number,
//   addressIndex: number,
//   addressToContact = get(contactByAddress),
// ) => {
//   const $wallet = get(wallets)[walletIndex]
//   if (!$wallet) return null
//   const w = $wallet.wallet as ethers.HDNodeWallet
//   let address: Hex = w.address as Hex
//   if (w.mnemonic) {
//     const account = mnemonicToAccount(w.mnemonic.phrase, {
//       path: derivePath($wallet, addressIndex)!,
//     })
//     address = account.address
//   }
//   if (!address || !$wallet) {
//     return null
//   }
//   const seed = walletMetadata($wallet, walletIndex)
//   return {
//     address,
//     index: addressIndex,
//     name: addressToContact.get(address)?.name || defaultName(seed!.type, walletIndex, addressIndex),
//     seed,
//   } as Account
// }

// const encrypt = async (decrypted: Decrypted, $password: string) => {
//   const encrypted = await decrypted.wallet.encrypt($password)
//   return {
//     ...decrypted,
//     wallet: JSON.parse(encrypted) as ParsedEncrypted,
//   }
// }

// export const addWallet = async (w: string | Hex, password: string, pathType = PathTypes.BIP44) => {
//   const walletIsHex = isHex(w)
//   const encryptable = walletIsHex ? new ethers.Wallet(w) : ethers.HDNodeWallet.fromPhrase(w)
//   const $wallets = get(persistedWallets)
//   const decrypted = {
//     wallet: encryptable,
//     pathType,
//     indices: walletIsHex ? [0] : new Array(50).fill(0).map((_v, i) => i),
//     added: $wallets.length ? [] : [0],
//   } as Decrypted
//   const encrypted = await encrypt(decrypted, password)
//   const newIndex = $wallets.length
//   persistedWallets.push(encrypted)
//   return newIndex
// }

// export const addWalletUnderCurrent = async (w: string | Hex, pathType = PathTypes.BIP44) => {
//   const $password = get(password)
//   if (!$password) throw new Error('no pass!')
//   return await addWallet(w, $password, pathType)
// }

// /**
//  * change the password of the secrets held in storage
//  * @param current the current password
//  * @param next the desired password to use
//  */
// export const changePassword = async (current: string, next: string) => {
//   const before = get(pw)
//   loading.increment('decrypt')
//   try {
//     const beforeDecrypted = await Promise.all(before.map(($encrypted, i) => decrypt($encrypted, i, current)))
//     // const afterPrivateKey = passwordToPrivateKey(next)
//     // const afterPublicKey = ETHCrypto.publicKeyByPrivateKey(afterPrivateKey)
//     const afterEncrypted = await Promise.all(
//       beforeDecrypted.map(($decrypted) =>
//         // ETHCrypto.encryptWithPublicKey(afterPublicKey, $decrypted)
//         encrypt($decrypted, next),
//       ),
//     )
//     pw.set(afterEncrypted)
//   } finally {
//     loading.decrement('decrypt')
//   }
//   // const before = await storage.load(current)
//   // const beforeClient = await storage.client.loadOrCreate(before)
//   // const beforeStore = beforeClient.getStore()
//   // const [
//   //   encodedWallets,
//   // ] = await Promise.all([
//   //   beforeStore.get(STORAGE_KEY),
//   // ])
//   // const after = await storage.load(next)
//   // const afterClient = await storage.client.loadOrCreate(after)
//   // const afterStore = afterClient.getStore()
//   // await afterStore.insert(STORAGE_KEY, Array.from(encodedWallets || []))
//   // await after.save()
//   // await before.unload()
// }

// /**
//  * set the global password of the encrypted mnemonics + private keys held in storage
//  * @param pass the password to attempt. if it is correct, it will set the password store
//  * @returns boolean to signal success or failure
//  */
// export const holdPasswordIfCorrect = async (pass: string) => {
//   const $pw = get(pw)
//   const first = $pw[0]
//   if (!first) return false
//   const result = await checkPassword(pass)
//   if (result) {
//     password.set(pass)
//   }
//   return result
// }

// export const revealSecret = async (pass: string, walletIndex: number, addressIndex?: number) => {
//   if (!(await checkPassword(pass, walletIndex))) {
//     return false
//   }
//   const $wallet = get(wallets)?.[walletIndex]
//   if (!$wallet) {
//     return null
//   }
//   const w = $wallet.wallet
//   const phraseWallet = w as ethers.HDNodeWallet
//   const pkWallet = w as ethers.Wallet
//   const mnemonic = phraseWallet.mnemonic as ethers.Mnemonic
//   if (!mnemonic) {
//     return pkWallet.privateKey
//   }
//   const phrase = mnemonic.phrase
//   if (addressIndex == null) {
//     return phrase
//   }
//   const account = mnemonicToAccount(phrase, {
//     path: derivePath($wallet, addressIndex)!,
//   })
//   const pk = account.getHdKey().privateKey
//   if (!pk) {
//     return pk
//   }
//   return bytesToHex(pk)
// }

// export const checkPassword = async (pass: string, index: number = 0) => {
//   const $pw = get(pw)
//   const first = $pw[index]
//   try {
//     loading.increment('decrypt')
//     await decrypt(first, index, pass)
//     return true
//   } catch (err: unknown) {
//     console.log(err)
//     return false
//   } finally {
//     loading.decrement('decrypt')
//   }
// }

// export const unsetPassword = () => {
//   wipeUnsafe()
//   password.set(null)
// }

// export const deriveAddresses = (
//   $seedIndex: number,
//   $wallet: Wallet<W>,
//   indices = $wallet.indices!,
//   addressToContact = get(contactByAddress),
// ) => {
//   const pathDeriver = paths.get($wallet.pathType)!
//   return indices.map((index) => {
//     const account = mnemonicToAccount(($wallet.wallet as ethers.HDNodeWallet).mnemonic!.phrase, {
//       path: pathDeriver.path(index),
//     })
//     return {
//       address: account.address,
//       index,
//       name: addressToContact.get(account.address)?.name || defaultName('phrase', $seedIndex, index),
//       seed: walletMetadata($wallet as unknown as Encrypted, $seedIndex)!,
//     }
//   })
// }

// export const deriveAddressesFromCurrent = (indices: number[]) => {
//   const $wallet = get(wallet)
//   return getAddresses(get(currentWalletIndex), $wallet, indices)
// }

// export const deriveAddedAddressesUnder = (index: number, indices?: number[]) => {
//   const $wallets = get(wallets)
//   const $wallet = $wallets[index]
//   if (!$wallet) return []
//   const list = indices || $wallet.added
//   return deriveAddresses(index, $wallet, list)
// }

// export const currentWalletMetadata = derived([wallet, currentWalletIndex], ([$wallet, $currentWalletIndex]) =>
//   walletMetadata($wallet as unknown as Encrypted, $currentWalletIndex),
// )

// const defaultName = (type: SeedType, seedIndex: number, addressIndex: number) => {
//   if (type === 'phrase') {
//     return `Seed Phrase ${seedIndex + 1} # ${addressIndex + 1}`
//   }
//   // type === 'pk'
//   return `Private Key ${seedIndex + 1}`
// }

// const getAddresses = ($seedIndex: number, $wallet: Decrypted, added = $wallet.added): Account[] => {
//   if (!$wallet) {
//     return []
//   }
//   const mWallet = $wallet.wallet as ethers.HDNodeWallet
//   if (!mWallet.mnemonic) {
//     const pkWallet = $wallet.wallet as ethers.Wallet
//     return [
//       {
//         index: 0,
//         address: pkWallet.address as Hex,
//         name: $wallet.name || defaultName('pk', $seedIndex, 0),
//         seed: walletMetadata($wallet as unknown as Encrypted, $seedIndex)!,
//       },
//     ]
//   }
//   return deriveAddresses($seedIndex, $wallet as Wallet<W>, added)
// }

// export const addedAddresses = derived([wallet, currentWalletIndex], ([$wallet, $currentWalletIndex]) => {
//   return getAddresses($currentWalletIndex, $wallet)
// })

// type ChainState = {
//   latest: number
//   pending: number
// }

// export const nonces = derived<
//   [Writable<Block | null>, Readable<PublicClient>, Readable<Hex | null>],
//   ChainState | null
// >(
//   // current block used as a clock tick
//   [currentBlock, currentPublicClient, currentAddress],
//   ([$currentBlock, $currentPublicClient, $currentAddress], set) => {
//     if (!$currentBlock || !$currentAddress || !$currentPublicClient) {
//       set(null)
//       return
//     }
//     Promise.all([
//       $currentPublicClient.getTransactionCount({
//         blockTag: 'latest',
//         address: $currentAddress,
//       }),
//       $currentPublicClient.getTransactionCount({
//         blockTag: 'pending',
//         address: $currentAddress,
//       }),
//     ]).then(([latest, pending]) =>
//       set({
//         latest,
//         pending,
//       } as ChainState),
//     )
//   },
// )

// export const checkWallets = () => {
//   if (!get(wallet)) {
//     setTimeout(() => {
//       if (get(wallet)) return
//       goto('/locked')
//     }, 300)
//   }
// }

// export const sendTransaction = async (input: SendTransactionParameters) => {
//   console.log(input)
//   const $wallet = get(wallet)
//   const $path = get(path)
//   if (!$path) {
//     throw new Error('path')
//   }
//   const account = currentAccount($path, $wallet, get(currentAddressIndex))
//   if (!account) {
//     throw new Error('account')
//   }
//   const $chain = get(chain)
//   const walletClient = createWalletClient({
//     account,
//     transport: transportByChain($chain),
//   })
//   return walletClient.sendTransaction(input)
// }

// export const walletMetadataFromIndex = (walletIndex: number) => {
//   const $wallets = get(persistedWallets)
//   const $wallet = $wallets[walletIndex]
//   if (!$wallet) {
//     return null
//   }
//   return walletMetadata($wallet, walletIndex)
// }

// export const walletMetadata = ($wallet: Encrypted | Decrypted, index: number) => {
//   if (!$wallet) {
//     return null
//   }
//   return {
//     type:
//       !($wallet.wallet as ParsedEncrypted)['x-ethers'] && !($wallet.wallet as ethers.HDNodeWallet).mnemonic
//         ? 'pk'
//         : 'phrase',
//     pathType: $wallet.pathType,
//     indices: $wallet.indices,
//     added: $wallet.added,
//     index,
//   } as const
// }

// export const commitmentFromAccountSignature = async (account: Account, $chain: Chain, $poolAddress: Hex) => {
//   const secret = await secretFromAccountSignature(account, $chain, $poolAddress)
//   if (!secret) {
//     return null
//   }
//   return secretToCommitment(secret!)
// }

// export const secretToCommitment = (secret: BigNumberish) => {
//   const commitment = pools.poseidon([secret])
//   return numberToHex(BigInt(commitment.toString()), { size: 32 })
// }
