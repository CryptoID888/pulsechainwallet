import _ from 'lodash'
// for some reason i couldn't get this package to work appropriately. kept getting
// errors about the file not being a database file.
import BetterSqlite3, { SqliteError } from 'better-sqlite3-multiple-ciphers'
// import BetterSqlite3 from 'better-sqlite3'

import { paths } from '$main/paths'
import { type AllSQLQueryKeys, backendOnlyQueries, queries, type SQLQueryKeys } from '$common/sql'
import * as fs from 'fs'
import path from 'path'

// best not to export this and force everything to go through the query function
// so that this file can control the migration process

fs.mkdirSync(path.dirname(paths.db), { recursive: true })

let db: BetterSqlite3.Database | null = null

// all prepared queries against the current db
let preparedQueries: null | Record<SQLQueryKeys, BetterSqlite3.Statement> = null

import walletMigrationUp from './migrations/V000__wallet.up.sql?asset'
import accountMigrationUp from './migrations/V001__account.up.sql?asset'
import transactionMigrationUp from './migrations/V002__chain-transaction.up.sql?asset'
import contactMigrationUp from './migrations/V003__contact.up.sql?asset'
import proofMigrationUp from './migrations/V004__proof.up.sql?asset'
import { setTimeout } from 'timers/promises'
import { handle } from '$main/ipc'
import { StatementParams } from '$common/types'

const migrationsUp = [
  walletMigrationUp,
  accountMigrationUp,
  transactionMigrationUp,
  contactMigrationUp,
  proofMigrationUp,
]

const migrate = (db: BetterSqlite3.Database, migrationPaths: string[]) =>
  db!.transaction((migrationPaths: string[]) => {
    for (const migration of migrationPaths) {
      const contents = fs.readFileSync(migration)
      db!.prepare(contents.toString()).run()
    }
  })(migrationPaths)

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
  const start = Date.now()
  do {
    err = null
    try {
      return createDb(newKey)
    } catch (e) {
      console.log(e)
      err = e as SqliteError
      setTimeout(1_000)
    }
  } while (start + 5 * 1_000 < Date.now())
  throw err
}

const prepare = (db: BetterSqlite3.Database) => {
  migrate(db, migrationsUp)
  return _.mapValues(
    {
      ...queries,
      ...backendOnlyQueries,
    },
    (query) => db!.prepare(query),
  )
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
type BoolReturner = (...args: string[]) => Promise<boolean> | boolean
const boolReturn = <BR extends BoolReturner>(fn: BR) => {
  return async (...args: Parameters<BR>) => {
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

handle('password:login', password.login)
handle('password:check', password.check)
handle('password:change', password.change)
handle('password:logout', password.logout)

const statementFromQueryKey = (queryKey: AllSQLQueryKeys) => {
  preparedQueries = preparedQueries || prepare(db!)
  return preparedQueries[queryKey] as BetterSqlite3.Statement
}

const queryCheck = <
  method extends 'run' | 'get' | 'all',
  T = unknown,
  R = method extends 'run' ? BetterSqlite3.RunResult : method extends 'get' ? T | null : T[],
>(
  fn: (stmt: BetterSqlite3.Statement, ...args: StatementParams[]) => R,
) => {
  return <U = T, R = method extends 'run' ? BetterSqlite3.RunResult : method extends 'get' ? U | null : U[]>(
    queryKey: AllSQLQueryKeys,
    params: Parameters<BetterSqlite3.Statement['run']> = [],
  ) => {
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
  run: queryCheck<'run'>(
    <I extends BetterSqlite3.RunResult>(stmt: BetterSqlite3.Statement, params: StatementParams = []) => {
      return stmt.run(...params) as I
    },
  ),
  get: queryCheck<'get'>((stmt: BetterSqlite3.Statement, params: StatementParams = []) => {
    return stmt.get(...params)
  }),
  all: queryCheck<'all'>((stmt: BetterSqlite3.Statement, params: StatementParams = []) => {
    return stmt.all(...params)
  }),
}

const onlyFrontend = (queryKey: AllSQLQueryKeys) => {
  if (!(queryKey in queries)) {
    throw new Error('This query is not available on the frontend')
  }
}

handle('sql:run', async (queryKey: SQLQueryKeys, ...params: StatementParams[]) => {
  onlyFrontend(queryKey)
  return query.run(queryKey, ...params)
})

handle('sql:get', async (queryKey: SQLQueryKeys, ...params: StatementParams[]) => {
  onlyFrontend(queryKey)
  return query.get(queryKey, ...params)
})

handle('sql:all', async (queryKey: SQLQueryKeys, ...params: StatementParams[]) => {
  onlyFrontend(queryKey)
  return query.all(queryKey, ...params)
})

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
// type VariableArgFunction = <R, T extends unknown[] = []>(...params: T) => R
// type ArgumentTypes<F extends VariableArgFunction> = F extends (...args: infer A) => unknown ? A : never
export const futureTransaction = <P extends unknown[], R>(fn: (...p: P) => R) => {
  return (...args: P) => (db!.transaction(fn) as BetterSqlite3.Transaction<(...p: P) => R>)(...args)
}
