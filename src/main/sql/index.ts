import _ from 'lodash'
import { ipcMain } from 'electron'
// for some reason i couldn't get this package to work appropriately. kept getting
// errors about the file not being a database file.
import BetterSqlite3, { SqliteError, Transaction } from 'better-sqlite3-multiple-ciphers'
// import BetterSqlite3 from 'better-sqlite3'

import { paths } from '../paths';
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
import transactionMigrationUp from './migrations/V002__transaction.up.sql?asset'
import contactMigrationUp from './migrations/V003__contact.up.sql?asset'
import proofMigrationUp from './migrations/V004__proof.up.sql?asset'
import chainTransactionMigrationUp from './migrations/V005__chain-transaction.up.sql?asset'
import { Account, WalletMetadata } from '$common/wallets';
import { Hex } from 'viem';
import { setTimeout } from 'timers/promises';

const migrationsUp = [
  walletMigrationUp,
  accountMigrationUp,
  transactionMigrationUp,
  contactMigrationUp,
  proofMigrationUp,
  chainTransactionMigrationUp,
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
const boolReturn = (fn: (...args: any[]) => Promise<void | boolean> | boolean | void) => {
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
    // console.log('check')
    createDb(Buffer.from(pass))
    return true
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
    await setTimeout(500)
    return true
  }),
}

ipcMain.handle('password:login', (_, pass: string) => {
  return password.login(pass)
})

ipcMain.handle('password:check', async (_, pass: string) => {
  const result = await password.check(pass)
  return result
})

ipcMain.handle('password:change', (_, current: string, next: string) => {
  return password.change(current, next)
})

ipcMain.handle('password:logout', (_) => {
  return password.logout()
})

const statementFromQueryKey = async (queryKey: AllQueryKeys) => {
  preparedQueries = preparedQueries || prepare(db!)
  return preparedQueries[queryKey]
}

const queryCheck = (fn: (...args: any[]) => any) => {
  return async <T>(queryKey: AllQueryKeys, params: any[]) => {
    const stmt = await statementFromQueryKey(queryKey)
    try {
      return await fn(stmt, params) as T
    } catch (err) {
      console.log('failed', err)
      console.log('inputs', queryKey, params)
      throw err
    }
  }
}

export const query = {
  run: queryCheck(async (stmt: BetterSqlite3.Statement, params: any[]) => {
    return stmt.run(...params) as BetterSqlite3.RunResult
  }),
  get: queryCheck(async <T>(stmt: BetterSqlite3.Statement, params: any[]) => {
    return stmt.get(...params) as T | null
  }),
  all: queryCheck(async <T>(stmt: BetterSqlite3.Statement, params: any[]) => {
    return stmt.all(...params) as T[]
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

//
// transactions
//
export const addWallet = () => db!.transaction(async (wallet: WalletMetadata, accounts: Account[] = []) => {
  const count = await query.get<{ count: number }>('WALLET_COUNT', [])
  await query.run('WALLET_INSERT', [wallet])
  await Promise.all(accounts.map((account) => query.run('ACCOUNT_INSERT', [{
    ...account,
    added: account.added ? 1 : 0,
  }])))
  return count.count
}) as Transaction<(a: WalletMetadata, b: Account[]) => Promise<number>>

export const nullifyAndSetAdded = () => db!.transaction(async (walletId: Hex, added: number[]) => {
  await query.run('ACCOUNT_NULLIFY_ADDED', [{ wallet_id: walletId }])
  await Promise.all(added.map((i) => query.run('ACCOUNT_SET_ADDED', [{
    wallet_id: walletId,
    address_index: i,
  }])))
}) as Transaction<(a: Hex, b: number[]) => Promise<void>>

