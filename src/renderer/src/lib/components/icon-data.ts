import { addCollection } from '@iconify/svelte'
import { allIconKeys } from './icon'

export const iconData = new Map<string, Map<string, void>>()

for (const [prefix] of allIconKeys.entries()) {
  await import(`../svg/${prefix}.json`)
    .then(({ default: data }) => {
      addCollection(data)
    })
    .catch(console.error)
}
