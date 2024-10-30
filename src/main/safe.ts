
// wraps the secret in an object so that the keys can

import { PathTypes, derivePath } from "$common/path"
import { Phrase, PK, PrivateWalletInfo } from "$common/wallets"
import { safeStorage } from "electron"
import { fromHex, HDAccount, type Hex, PrivateKeyAccount, toHex } from "viem"
import { privateKeyToAccount, mnemonicToAccount } from "viem/accounts"

// help differentate between pk and phrase
export const encrypt = (secret: PrivateWalletInfo) => {
  return toHex(safeStorage.encryptString(secret))
}
export const decrypt = (secret: Hex) => {
  return safeStorage.decryptString(Buffer.from(fromHex(secret, {
    to: 'bytes',
  })))
}

export const deriveAccountFromSecret = (pathType: PathTypes, wallet: PrivateWalletInfo, index: number): HDAccount | PrivateKeyAccount => {
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
