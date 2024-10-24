// // import * as graphqlRequest from 'graphql-request'
// import * as pools from '../pools'
// import { writable } from 'svelte/store'
// import type { Hex } from 'viem'

import type { Hex } from "viem";

// // allow url to be updated from config or server
// let url = 'http://localhost:42069/graphql'

// export const init = () => {
//   watch()
//   pools.init()
// }

// const metaQuery = `query {
//   _meta {
//     status
//   }
// }`

type ChainStatus = {
  ready: boolean;
  block: {
    timestamp: number;
    number: number;
  }
}

type Status = {
  pulsechainV4: ChainStatus;
}

type StatusResponse = { _meta: { status: Status } }

// export const status = writable<Status | null>(null)

// let statusFailedCounter = 0

// const fetchStatus = () => {
//   graphqlRequest.request<StatusResponse>(url, metaQuery)
//     .then((data) => {
//       status.set(data._meta.status)
//     })
//     .catch(async (error) => {
//       console.error(error)
//       statusFailedCounter++
//       status.set(null)
//       if (statusFailedCounter > 1) {
//         await restartPonder()
//         statusFailedCounter = 0
//       }
//     })
// }

// const restartPonder = async () => {
//   console.log('restarting ponder')
//   await invoke('ponder::restart')
// }

// export const watch = () => {
//   fetchStatus()
//   setInterval(fetchStatus, 10_000)
// }

export type Deposit = {
  id: Hex
  logIndex: number
  commitment: Hex
  leaf: Hex
  leafIndex: number
  transactionId: Hex
  blockId: Hex
  chainId: number
  pool: {
    id: Hex
    address: Hex
    denomination: bigint
    asset: Hex
  }
}

type KnownCommitmentsResponse = { deposits: { items: Deposit[] } }

export const fetchDepositsFromCommitments = async (commitments: Hex[]) => {
  return await graphqlRequest.request<KnownCommitmentsResponse>(url, depositsFromCommitmentsQuery, {
    commitments,
  }).then((data) => {
    // console.log(data.deposits.items)
    return data.deposits.items
    // return _.uniq(data.deposits.items.map((item) => item.commitment))
  }, (err) => {
    console.log('error', err)
    return []
  })
}

// const depositsFromCommitmentsQuery = graphqlRequest.gql`
// query KnownDeposits($commitments: [String!]!) {
//   deposits(where: {
//     commitment_in: $commitments
//   }, orderBy: "logIndex", orderDirection: "asc") {
//     items {
//       id,
//       logIndex,
//       commitment,
//       leaf,
//       leafIndex,
//       transactionId,
//       blockId,
//       chainId,
//       pool {
//         id,
//         address,
//         denomination,
//         asset
//       }
//     }
//   }
// }`

// const leavesUnderPoolQuery = graphqlRequest.gql`
// query AllKnownLeaves($poolId: String!) {
//   deposits(where: {
//     poolId: $poolId
//   }, orderBy: "leafIndex", orderDirection: "asc") {
//     items {
//       leaf
//     }
//   }
// }`

type AllKnownLeavesResponse = { deposits: { items: { leaf: Hex }[] } }

// export const fetchLeavesUnderPool = async (poolId: Hex) => {
//   return await graphqlRequest.request<AllKnownLeavesResponse>(url, leavesUnderPoolQuery, {
//     poolId,
//   }).then((data) => {
//     return data.deposits.items.map((item) => item.leaf)
//   }, (err) => {
//     console.log('error', err)
//     return [] as Hex[]
//   })
// }

// const withdrawalQuery = graphqlRequest.gql`
// query Withdrawal($poolId: String!, $leafIndex: BigInt!, $nullifier: String!) {
//   deposits(where: {
//     poolId: $poolId
//     leafIndex: $leafIndex
//   }) {
//     items {
//       leafIndex,
//       pool {
//         id
//         address
//         chainId
//       }
//     }
//   },
//   withdrawals(where: {
//     nullifier: $nullifier
//   }) {
//     items {
//       nullifier
//       transaction {
//         hash
//       }
//     }
//   }
// }`

type DepositFromWithdrawalInfo = {
  leafIndex: number
  pool: {
    id: Hex
    address: Hex
    chainId: number
  }
}

type WithdrawalFromWithdrawalInfo = {
  nullifier: Hex
  transaction: {
    hash: Hex
  }
}

type WithdrawalResponse = {
  deposits: {
    items: DepositFromWithdrawalInfo[]
  },
  withdrawals: {
    items: WithdrawalFromWithdrawalInfo[]
  }
}

// export const getWithdrawal = async (poolId: Hex, leafIndex: number, nullifier: Hex) => {
//   const {
//     deposits: { items: [deposit] },
//     withdrawals: { items: [withdrawal] },
//   } = await graphqlRequest.request<WithdrawalResponse>(url, withdrawalQuery, {
//     poolId,
//     leafIndex,
//     nullifier,
//   })
//   return { deposit, withdrawal }
// }

