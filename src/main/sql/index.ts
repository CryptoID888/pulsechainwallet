import _ from 'lodash'
import { ipcMain } from 'electron'
// for some reason i couldn't get this package to work appropriately. kept getting
// errors about the file not being a database file.
import BetterSqlite3, { SqliteError, Transaction } from 'better-sqlite3-multiple-ciphers'
// import BetterSqlite3 from 'better-sqlite3'

import { paths } from '$main/paths';
import { AllQueryKeys, backendOnlyQueries, queries, type QueryKeys } from '$common/sql'
import * as fs from 'fs';
import path from 'path';

// best not to export this and force everything to go through the query function
// so that this file can control the migration process

fs.mkdirSync(path.dirname(paths.db), { recursive: true })

let db: BetterSqlite3.Database | null = null

// all prepared queries against the current db
let preparedQueries: null | Record<QueryKeys, BetterSqlite3.Statement> = null

import walletMigrationUp from './migrations/V000__wallet.up.sql?asset'
import accountMigrationUp from './migrations/V001__account.up.sql?asset'
import transactionMigrationUp from './migrations/V002__chain-transaction.up.sql?asset'
import contactMigrationUp from './migrations/V003__contact.up.sql?asset'
import proofMigrationUp from './migrations/V004__proof.up.sql?asset'
import { Account, InsertableWalletMetadata, WalletMetadata } from '$common/wallets';
import { Hex } from 'viem';
import { setTimeout } from 'timers/promises';
import type { InsertableProof } from '$common/pools';
import { handle } from '$main/ipc';

const migrationsUp = [
  walletMigrationUp,
  accountMigrationUp,
  transactionMigrationUp,
  contactMigrationUp,
  proofMigrationUp,
]

const migrate = (db: BetterSqlite3.Database, migrationPaths: string[]) => (
  db!.transaction((migrationPaths: string[]) => {
    for (const migration of migrationPaths) {
      const contents = fs.readFileSync(migration)
      db!.prepare(contents.toString()).run()
    }
  })(migrationPaths)
)

const createDb = (pass: Buffer) => {
  const d = BetterSqlite3(paths.db, {
    // verbose: console.log,
  })
  const exists = fs.existsSync(paths.db)
  if (!exists) {
    d.pragma('user_version=0')
  }
  d.key(pass)
  d.pragma('user_version=0')
  d.pragma('secure_delete=ON')
  d.pragma('auto_vacuum=FULL')
  d.pragma(`busy_timeout=5000`)
  d.pragma('synchronous=NORMAL')
  d.pragma('foreign_keys=ON')
  d.pragma(`encoding='UTF-8'`)
  d.pragma('journal_mode=WAL')
  d.pragma('wal_checkpoint(PASSIVE)')
  return d
}

const rekey = async (d: BetterSqlite3.Database, key: Buffer, newKey: Buffer) => {
  if (!d) {
    throw new Error('no db to rekey')
  }
  d.key(key)
  await d.pragma('journal_mode=DELETE')
  d.prepare('VACUUM;').run()
  d.rekey(newKey)
  d.prepare('VACUUM;').run()
  d.pragma('optimize')
  d.close()
  // for whatever reason, create db throws if a createdb is called too quickly
  // may have to do with the time it takes to re-encrypt the db. unsure
  // another solution would be to simply keep trying, on a delay, to re-create the db
  await setTimeout(1000)
  let err: SqliteError | null = null
  let start = Date.now()
  do {
    err = null
    try {
      return createDb(newKey)
    } catch (e) {
      console.log(e)
      err = e as SqliteError
      setTimeout(1_000)
    }
  } while (start + 5 * 1_000 < Date.now());
  throw err
}

const prepare = (db: BetterSqlite3.Database) => {
  migrate(db, migrationsUp)
  return _.mapValues({
    ...queries,
    ...backendOnlyQueries,
  }, (query) => db!.prepare(query))
}

/**
 * returns a function that will run the fn in a try.
 * it will return true if the fn does not fail when called
 *
 * variable sets inside of fn should occur last so that
 * partial module state updates do not occur
 * @param fn a function to run in a try
 * @returns a true if the fn does not err
 */
const boolReturn = (fn: (...args: any[]) => Promise<boolean> | boolean) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (err) {
      console.log(err)
      return false
    }
  }
}

/**
 * password methods for decrypting the db, changing the db password, attempting login, and logging out
 */
export const password = {
  check: boolReturn((pass: string) => {
    try {
      createDb(Buffer.from(pass))
      return true
    } catch (err: unknown) {
      const e = err as { code: string }
      if (e.code !== 'SQLITE_NOTADB') {
        throw e
      }
      return false
    }
  }),
  change: boolReturn(async (current: string, next: string) => {
    // console.log('change')
    try {
      db = await rekey(db!, Buffer.from(current), Buffer.from(next))
      preparedQueries = null
      return true
    } catch (err: unknown) {
      const e = err as { code: string }
      if (e.code !== 'SQLITE_NOTADB') {
        throw e
      }
      console.log('change failed %o', e.code)
      return false
    }
  }),
  login: boolReturn((attempt: string) => {
    // console.log('attempt')
    try {
      db = createDb(Buffer.from(attempt))
      setupTasks.forEach((task) => task.up())
    } catch (err: unknown) {
      const e = err as { code: string }
      if (e.code !== 'SQLITE_NOTADB') {
        throw e
      }
      console.log('attempt failed %o', e.code)
      return false
    }
    preparedQueries = null
    return true
  }),
  /**
   * close and tear down the db
   * @returns boolean to indicate success
   */
  logout: boolReturn(async () => {
    if (!db) return false
    db.close()
    db = null
    preparedQueries = null
    setupTasks.forEach((task) => task.down())
    await setTimeout(500)
    return true
  }),
}

ipcMain.handle('password:login', (_, pass: string) => {
  return password.login(pass)
})

handle('password:check', password.check)

ipcMain.handle('password:change', (_, current: string, next: string) => {
  return password.change(current, next)
})

ipcMain.handle('password:logout', (_) => {
  return password.logout()
})

const statementFromQueryKey = (queryKey: AllQueryKeys) => {
  preparedQueries = preparedQueries || prepare(db!)
  return preparedQueries[queryKey]
}

const queryCheck = <
  method extends 'run' | 'get' | 'all',
  T = any,
  R = method extends 'run'
  ? BetterSqlite3.RunResult
  : method extends 'get'
  ? T | null
  : T[]
>(fn: (...args: any[]) => R) => {
  return <T, R = method extends 'run'
    ? BetterSqlite3.RunResult
    : method extends 'get'
    ? T | null
    : T[]>(queryKey: AllQueryKeys, params: any[] = []) => {
    const stmt = statementFromQueryKey(queryKey)
    try {
      return fn(stmt, params) as unknown as R
    } catch (err) {
      console.log('failed', err)
      // console.log('inputs', queryKey, params)
      throw err
    }
  }
}

export const query = {
  run: queryCheck<'run'>(<I>(stmt: BetterSqlite3.Statement, params: any[] = []) => {
    return stmt.run(...params) as I
  }),
  get: queryCheck<'get'>(<I>(stmt: BetterSqlite3.Statement, params: any[] = []) => {
    return stmt.get(...params) as I | null
  }),
  all: queryCheck<'all'>(<I>(stmt: BetterSqlite3.Statement, params: any[] = []) => {
    return stmt.all(...params) as I[]
  }),
}

const onlyFrontend = (queryKey: AllQueryKeys) => {
  if (!(queryKey in queries)) {
    throw new Error('This query is not available on the frontend')
  }
}

ipcMain.handle("sql:run", async (_event: Electron.IpcMainInvokeEvent, queryKey: QueryKeys, params: any[]) => {
  onlyFrontend(queryKey)
  return query.run(queryKey, params)
});

ipcMain.handle("sql:get", async (_event: Electron.IpcMainInvokeEvent, queryKey: QueryKeys, params: any[]) => {
  onlyFrontend(queryKey)
  return query.get(queryKey, params)
});

ipcMain.handle("sql:all", async (_event: Electron.IpcMainInvokeEvent, queryKey: QueryKeys, params: any[]) => {
  onlyFrontend(queryKey)
  return query.all(queryKey, params)
});

type Task = {
  up: () => void
  down: () => void
}

const setupTasks: Task[] = []

export const addSetupTask = (task: Task) => {
  setupTasks.push(task)
  // should only happen when the db is decrypted, but
  // if more handlers are added later, no need to wait
  if (db) {
    task.up()
  }
}

//
// transactions
//
// the unique characteristic about these transactions is that they first return a function as they are being prepared
//
export const addWallet = () => db!.transaction((wallet: InsertableWalletMetadata, accounts: Account[] = []) => {
  const result = query.get<{ count: number }>('WALLET_COUNT', [])
  if (!result) {
    throw new Error('no result from WALLET_COUNT')
  }
  const { count } = result
  const w = { ...wallet, user_order: count } as WalletMetadata
  query.run('WALLET_INSERT', [w])
  accounts.map((account) => query.run('ACCOUNT_INSERT', [{
    ...account,
    // this is because the db does not actually understand boolean types
    added: account.added ? 1 : 0,
  }]))
  return count
}) as Transaction<(a: InsertableWalletMetadata, b: Account[]) => number>

export const nullifyAndSetAdded = () => db!.transaction((walletId: Hex, added: number[]) => {
  query.run('ACCOUNT_NULLIFY_ADDED', [{ wallet_id: walletId }])
  added.map((i) => query.run<Account>('ACCOUNT_SET_ADDED', [{
    wallet_id: walletId,
    address_index: i,
  }]))
}) as Transaction<(a: Hex, b: number[]) => void>

export const insertProofs = (proofs: InsertableProof[]) => (db!.transaction((proofs: InsertableProof[]) => {
  proofs.map((proof) => query.run('PROOF_INSERT', [proof]))
}) as Transaction<(a: InsertableProof[]) => void>)(proofs)

export const sendWork = () => db!.transaction(async (poolId: string, leafIndex: number, fn: () => Promise<Hex>) => {
  // run a query locally first to reduce the chance of
  // local failing after the work has been sent
  query.run('UPDATE_WORK_STATE', [{
    pool_id: poolId,
    leaf_index: leafIndex,
    work_state: 'broadcasted',
  }])
  const id = await fn()
  query.run('UPDATE_MSG_ID', [{
    pool_id: poolId,
    leaf_index: leafIndex,
    message_hash: id,
  }])
  return id
}) as Transaction<(a: string, b: number, c: () => Promise<Hex>) => Promise<Hex>>
