import { persisted } from 'svelte-persisted-store'
import _ from 'lodash'
import { derived, get } from 'svelte/store'
import * as viem from 'viem'

export type Contact = {
  address: viem.Hex
  name: string
  note: string | null
}

const c = persisted<Contact[]>('contacts', [])

export const contacts = {
  ...c,
  push: (contact: Contact) => {
    c.update(($c) => _.uniqWith($c.concat(contact), _.isEqual))
  },
  updateOne: (contact: Contact, updates: Partial<Contact>) => {
    const $c = get(c)
    const existingIndex = _.findIndex($c, contact)
    if (existingIndex === -1) return
    const existing = $c[existingIndex]
    const updated = {
      ...existing,
      ...updates,
    }
    const $updated = $c.slice(0)
    $updated[existingIndex] = updated
    c.set($updated)
  },
  remove: (contact: Contact) => {
    const $c = get(c)
    const index = _.findIndex($c, contact)
    if (index === -1) return
    const $updated = $c.slice(0, index).concat($c.slice(index + 1))
    c.set($updated)
  },
  has: (addr: viem.Hex) => {
    return !!get(c).find((contact) => contact.address === addr)
  },
}

export const contactByAddress = derived([c], ([$contacts]) => {
  return new Map($contacts.map(($contact) => [$contact.address, $contact] as const))
})
