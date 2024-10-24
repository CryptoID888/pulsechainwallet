import { push as goto } from 'svelte-spa-router'
import type { Hex } from 'viem'

export const sections = {
  navigation: () => ({
    name: 'Navigation',
    actions: [
      {
        name: 'Broadcast',
        click: () => {
          goto('/account/shield/broadcast')
        },
      },
      {
        name: 'Work',
        click: () => {
          goto('/account/shield/work')
        },
      },
    ],
  }),
  account: () => ({
    name: 'Account',
    actions: [
      {
        name: 'Home',
        click: () => {
          goto('/account')
        },
      },
      {
        name: 'Settings',
        click: () => {
          goto('/account/settings')
        },
      },
    ],
  }),
  security: () => ({
    name: 'Security',
    actions: [
      {
        name: 'Change Password',
        click: () => {
          goto('/account/security/change-password')
        },
      },
      {
        name: 'Lock',
        click: () => {
          goto('/lock')
        },
      },
    ],
  }),
  addresses: ($walletId: Hex) => ({
    name: 'Addresses',
    actions: [
      {
        name: 'Manage',
        click: () => {
          goto(`/account/addresses/manage`)
        },
      },
      {
        name: 'Add',
        click: () => {
          goto(`/account/addresses/${$walletId}/toggle`)
        },
      },
      // {
      //   name: 'Import Public Address',
      //   click: () => {
      //     goto('/account/addresses/public-address/import')
      //   },
      // },
    ],
  }),
  secrets: () => ({
    name: 'Secrets',
    actions: [
      {
        name: 'Phrase Create',
        click: () => {
          goto('/account/addresses/phrase/create')
        },
      },
      {
        name: 'Phrase Import',
        click: () => {
          goto('/account/addresses/phrase/import')
        },
      },
      {
        name: 'Private Key Create',
        click: () => {
          goto('/account/addresses/private-key/create')
        },
      },
      {
        name: 'Private Key Import',
        click: () => {
          goto('/account/addresses/private-key/import')
        },
      },
    ],
  }),
}
