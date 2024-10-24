// // import { Client, Store, Stronghold } from '@tauri-apps/plugin-stronghold';
// // import { appDataDir } from '@tauri-apps/api/path';
// // import * as app from '@tauri-apps/api/app';

// // const vaultPath = async () => (
// //   `${await appDataDir()}/databases/stronghold/vault.hold`
// // )

// // export const load = async (vaultPassword: string) => {
// //   console.log('Stronghold.load')
// //   return await Stronghold.load(await vaultPath(), vaultPassword);
// // }

// // export const client = {
// //   load: async (s: Stronghold) => {
// //     const clientName = await app.getName();
// //     console.log('Stronghold.loadClient')
// //     return await s.loadClient(clientName);
// //   },
// //   create: async (s: Stronghold) => {
// //     const clientName = await app.getName();
// //     console.log('Stronghold.createClient')
// //     return await s.createClient(clientName);
// //   },
// //   loadOrCreate: async (s: Stronghold) => {
// //     let c!: Client
// //     try {
// //       c = await client.load(s);
// //     } catch {
// //       c = await client.create(s);
// //     }
// //     return c
// //   },
// // }

// // export const encode = (value: string) => (
// //   Uint8Array.from(new TextEncoder().encode(value))
// // )

// // export const decode = (value: Awaited<ReturnType<Store["get"]>>) => (
// //   new TextDecoder().decode(new Uint8Array(value || []))
// // )

// // export const serialize = (value: object) => (
// //   encode(JSON.stringify(value)) as unknown as number[]
// // )

// // export const parse = <T>(value: Awaited<ReturnType<Store["get"]>>) => (
// //   JSON.parse(decode(value)) as T
// // )

// import { createStore, Store } from "@tauri-apps/plugin-store";
// import { persisted } from "svelte-persisted-store";
// // import { writable } from "svelte/store";
// import { keccak256, type Hex, stringToBytes, bytesToString } from "viem";

// // const walletCountStore = createStore('.walletmetadata.dat')

// export const walletCount = persisted('wallet-count', 0)

// const privateId = 0

// const walletStore = createStore('.wallets.dat')

// let password: Uint8Array | null = null

// let loaded!: Promise<Store>

// type Row = {
//   pwd: Hex;
//   data: Uint8Array;
// }

// type Stronghold = {
//   check: (rid: number) => void
// }

// export const load = async (pwd: string) => {
//   password = stringToBytes(pwd)
//   loaded = loaded || walletStore
//   loaded.then(async () => {
//     const walletStore = await loaded
//     // const walletCountStoreLoaded = await walletCountStore
//     // await walletCountStoreLoaded.save()
//     // await walletCountStoreLoaded.load()
//     walletCount.set(await walletStore.length())
//   })
//   return {
//     check: (rid: number) => {
//       if (rid !== privateId) {
//         throw new Error('can only be called by storage')
//       }
//     },
//     save: async () => {
//       const walletStore = await loaded
//       return walletStore.save()
//     },
//     unload: () => {
//       return Promise.resolve()
//     },
//   }
// }

// const resolveWithStore = {
//   get: async (key: string) => {
//     const walletStore = await loaded
//     const row = await walletStore.get<Row>(key)
//     if (!row) return null
//     if (row.pwd !== hashPwd()) {
//       throw new Error('pseudo password does not match')
//     }
//     return Uint8Array.from(row.data.slice(0))
//   },
//   insert: async (key: string, value: Array<number> | Uint8Array) => {
//     const serialized = {
//       pwd: hashPwd(),
//       data: value.slice(0),
//     }
//     const walletStore = await loaded
//     return walletStore.set(key, serialized)
//   },
// }

// const resolveWithClient = Promise.resolve({
//   getStore: () => {
//     return resolveWithStore
//   },
// })
// export const client = {
//   load: async (s: Stronghold) => {
//     s.check(privateId)
//     return loaded.then(() => resolveWithClient)
//   },
//   create: async (s: Stronghold) => {
//     s.check(privateId)
//     return loaded.then(() => resolveWithClient)
//   },
//   loadOrCreate: async (s: Stronghold) => {
//     s.check(privateId)
//     return loaded.then(() => resolveWithClient)
//   },
// }

// const hashPwd = () => (
//   keccak256(password as Uint8Array, 'hex')
// )

// export const encode = (val: string) => {
//   return stringToBytes(val)
// }

// export const decode = (val: Uint8Array) => {
//   return bytesToString(val)
// }

// export const serialize = (val: object) => {
//   return encode(JSON.stringify(val))
// }

// export const parse = <T>(val: Uint8Array) => {
//   return JSON.parse(decode(val)) as T
// }
