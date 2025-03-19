import { readFile } from 'node:fs/promises'
import { IconSet } from '@iconify/tools'
import path from 'node:path'
import { blankIconSet } from '@iconify/tools'
import { allIconKeys } from './src/renderer/src/lib/components/icon'
import * as fs from 'node:fs'

// Directories
const cacheDir = ['node_modules', '@iconify', 'json']
const outDir = ['src', 'renderer', 'src', 'lib', 'svg']
// Get a list of icon sets
const list = JSON.parse(await readFile(path.join(...cacheDir, 'collections.json'), 'utf8'))
const prefixes = Object.keys(list)

// Export each icon set
for (let i = 0; i < prefixes.length; i++) {
  const prefix = prefixes[i]
  const set = allIconKeys.get(prefix)
  if (!set) {
    continue
  }
  // Read file
  const data = JSON.parse(await readFile(path.join(...cacheDir, 'json', prefix + '.json'), 'utf8'))

  const emptySet = blankIconSet(prefix)

  // Create IconSet
  const iconSet = new IconSet(data)
  for (const key of set.values()) {
    if (!iconSet.exists(key)) {
      console.log(`icon ${prefix}:${key} is missing!`)
    }
    const icon = iconSet.resolve(key)!
    emptySet.setIcon(key, icon)
  }
  const json = emptySet.export(true)
  const jsonPath = path.join(...outDir, `${prefix}.json`)
  await fs.promises.mkdir(path.dirname(jsonPath), { recursive: true })
  await fs.promises.writeFile(jsonPath, JSON.stringify(json, null, 2))
}
