import BetterSqlite3 from 'better-sqlite3-multiple-ciphers'
import path from 'path'
import * as fs from 'fs'

const dataFolder = path.join(process.cwd(), 'data')

fs.mkdirSync(dataFolder, { recursive: true })
const dbPath = path.join(dataFolder, 'userdata.db')

const createDb = (pass: Buffer) => {
  const d = BetterSqlite3(dbPath, {
    // verbose: console.log,
  })
  if (!fs.existsSync(dbPath)) {
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

const rekey = (key: Buffer) => {
  db.pragma('journal_mode=DELETE')
  db.rekey(key)
  db.prepare('VACUUM;').run()
  db.close()
  return createDb(key)
}

let db = createDb(Buffer.from([0x01]))

db.close()

db = createDb(Buffer.from([0x01]))

db.exec(`CREATE TABLE IF NOT EXISTS numbers(
x INT PRIMARY KEY,
y INT NOT NULL
);`)

db.prepare('INSERT INTO numbers(x, y) VALUES(1, 2) ON CONFLICT DO NOTHING;').run()

console.log(db.prepare('select * from numbers;').all())

db = rekey(Buffer.from([0x02]))

db.prepare('INSERT INTO numbers(x, y) VALUES(2, 3) ON CONFLICT DO NOTHING;').run()

console.log(db.prepare('select * from numbers;').all())

db = rekey(Buffer.from([0x01]))

db.prepare('INSERT INTO numbers(x, y) VALUES(3, 4) ON CONFLICT DO NOTHING;').run()

console.log(db.prepare('select * from numbers;').all())
