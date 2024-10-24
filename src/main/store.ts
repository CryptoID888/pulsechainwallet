import * as fs from 'fs'
import path from 'path'
import { paths } from './paths'
import { writable as w } from 'svelte/store'

const io = {
  write: (key: string, value: object) => {
    const pathToFile = path.join(paths.data, `${key}.json`)
    const contents = valueToJSON.stringify(value)!
    fs.mkdirSync(paths.data, { recursive: true })
    fs.writeFileSync(pathToFile, contents)
  },
  read: <T>(key: string) => {
    const filePath = path.join(paths.data, `${key}.json`)
    try {
      const startInfo = fs.readFileSync(filePath, 'utf8')
      return valueToJSON.parse(startInfo) as T
    } catch (err) {
      return null
    }
  },
}

const valueToJSON = {
  stringify: (value: object) => {
    return JSON.stringify(value, (_k, v) => {
      if (typeof v === 'bigint') {
        return {
          type: 'bigint',
          value: v.toString(),
        }
      }
      return v
    }, 2)
  },
  parse: (value: string) => {
    return JSON.parse(value, (_k, v) => {
      if (v && typeof v === 'object' && v.type === 'bigint' && typeof v.value === 'string') {
        return BigInt(v.value)
      }
      return v
    })
  },
}

export const writable = <T>(key: string, defaultValue: T, merge: (a: T) => T = ((current) => ({
  ...defaultValue,
  ...current,
}))) => {
  const stored = io.read<T>(key) || defaultValue
  const store = w<T>(merge(stored))
  return {
    ...store,
    set: (value: T) => {
      io.write(key, value as object)
      store.set(value)
    },
    update: (fn: (value: T) => T) => {
      store.update(($value) => {
        const result = fn($value as T)
        // pit stop to save the value to disk
        io.write(key, result as object)
        return result
      })
    },
    updatePartial: (value: Partial<T>) => {
      store.update(($value) => {
        const result = {
          ...$value,
          ...value,
        }
        io.write(key, result)
        return result
      })
    },
  }
}
