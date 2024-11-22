import { futureTransaction, query } from '$main/sql'
import type { InsertableWalletMetadata, Account, WalletMetadata } from '$common/wallets'
import type { InsertableProof } from '$common/pools'
import type { Hex } from 'viem'

export const transactions = {
  addWallet: futureTransaction<[InsertableWalletMetadata, Account[]?], number>((wallet, accounts = []) => {
    const result = query.get<{ count: number }>('WALLET_COUNT', [])
    if (!result) {
      throw new Error('no result from WALLET_COUNT')
    }
    const { count } = result
    const w = { ...wallet, user_order: count } as WalletMetadata
    query.run('WALLET_INSERT', [w])
    accounts.map((account) =>
      query.run('ACCOUNT_INSERT', [
        {
          ...account,
          // this is because the db does not actually understand boolean types
          added: account.added ? 1 : 0,
        },
      ]),
    )
    return count
  }),

  nullifyAndSetAdded: futureTransaction<[Hex, number[]], void>((walletId, added) => {
    query.run('ACCOUNT_NULLIFY_ADDED', [{ wallet_id: walletId }])
    added.map((i) =>
      query.run<Account>('ACCOUNT_SET_ADDED', [
        {
          wallet_id: walletId,
          address_index: i,
        },
      ]),
    )
  }),

  insertProofs: futureTransaction((proofs: InsertableProof[]) => {
    proofs.map((proof) => query.run('PROOF_INSERT', [proof]))
  }),

  sendWork: futureTransaction(async (poolId: string, leafIndex: number, fn: () => Promise<Hex>) => {
    // run a query locally first to reduce the chance of
    // local failing after the work has been sent
    query.run('MARK_PROOF_AS_BROADCASTED', [
      {
        pool_id: poolId,
        leaf_index: leafIndex,
      },
    ])
    const id = await fn()
    query.run('UPDATE_MSG_ID', [
      {
        pool_id: poolId,
        leaf_index: leafIndex,
        message_hash: id,
      },
    ])
    return id
  }),
}
