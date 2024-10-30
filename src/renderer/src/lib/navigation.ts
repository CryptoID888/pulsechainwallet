import { get, writable } from 'svelte/store'
import type { Hex } from 'viem'

export type Crumb = {
  link?: string
  text: string
  icon: string
  iconSize?: number
}

let id = 0

type IdentifiableCrumb = {
  id: string
  crumb: Crumb
}

const c = writable<IdentifiableCrumb[]>([])

export const crumbtrail = {
  ...c,
  current: () => get(c).map((ic) => ic.crumb),
  remove: (id: string) => {
    c.update(($c) => $c.filter(($wc) => $wc.id !== id))
  },
  push: (next: Crumb) => {
    id++
    c.update(($c) =>
      $c.concat({
        id: `${id}`,
        crumb: next,
      }),
    )
    return `${id}`
  },
  reset: () => {
    c.set([])
  },
}

export const crumbs = {
  account: {
    text: 'Account',
    link: '/account',
    icon: 'mdi:house',
  } as Crumb,
  more: {
    text: 'More',
    link: '/account/more',
    icon: 'fa:tasks',
    iconSize: 16,
  } as Crumb,
  security: {
    text: 'Security',
    link: '/account/security',
  } as Crumb,
  changePassword: {
    text: 'Change Password',
    link: '/account/security/change-password',
  } as Crumb,
  addresses: {
    text: 'Addresses',
    link: '/account/addresses/manage',
    icon: 'lucide:contact-round',
  } as Crumb,
  key: (link: string) => ({
    text: 'Key',
    link,
    icon: 'fa:key',
    iconSize: 16,
  } as Crumb),
  manageAddresses: {
    text: 'Manage',
    link: '/account/addresses/manage',
    icon: 'fa:tasks',
    iconSize: 16,
  } as Crumb,
  send: {
    text: 'Send',
    link: '/account/send',
    icon: 'fa:paper-plane',
    iconSize: 16,
  } as Crumb,
  shield: {
    text: 'Shield',
    link: '/account/shield',
    icon: 'fa:shield',
    iconSize: 16,
  } as Crumb,
  broadcast: {
    text: 'Broadcast',
    link: '/account/shield/broadcast',
    icon: 'icon-park-twotone:broadcast',
    iconSize: 24,
  } as Crumb,
  work: {
    text: 'Work',
    link: '/account/shield/work',
    icon: 'fa:tasks',
    iconSize: 16,
  } as Crumb,
  assist: {
    text: 'Assist',
    link: '/account/shield/assist',
    icon: 'arcticons:mapassist',
    iconSize: 24,
  } as Crumb,
  receive: {
    text: 'Receive',
    link: '/account/receive',
    icon: 'fa:inbox',
    iconSize: 16,
  } as Crumb,
  transactions: {
    text: 'Activity',
    link: '/account/transactions',
    icon: 'bi:activity',
    iconSize: 24,
  } as Crumb,
  transactionDetails: (hash: Hex) => ({
    text: 'Details',
    icon: 'fa:list',
    link: `/account/transactions/${hash}`,
    iconSize: 16,
  } as Crumb),
  settings: {
    text: 'Settings',
    link: '/account/settings',
    icon: 'fa:cog',
    iconSize: 16,
  } as Crumb,
  // { name: 'Swap', path: '/account/swap', icon: 'fa:arrows-h' },
  // { name: 'Bridge', path: '/account/bridge', icon: 'fa:circle-o-notch' },
  addressDetail: ($wi: Hex, $ai: number) => ({
    text: 'Detail',
    icon: 'clarity:details-line',
    link: `/account/addresses/${$wi}/detail/${$ai}`,
  }),
} as const
