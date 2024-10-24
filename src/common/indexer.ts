import { gql } from "graphql-request";
import type { Hex } from "viem";

export const queries = {
  STATUS: gql`
query Status {
  _meta {
    status
  }
}`,
  ALL_POOLS_UNDER_ASSET: gql`
query AllPoolsUnderAsset($chainId: Int!, $asset: String!) {
  privacyPools(where: { chainId: $chainId, asset: $asset }) {
    items {
      address
      denomination
    }
  }
}`,
  DEPOSITS_FROM_COMMITMENTS: gql`
query DepositsFromCommitments($commitments: [String!]!) {
  deposits(where: {
    commitment_in: $commitments
  }, orderBy: "logIndex", orderDirection: "asc") {
    items {
      id,
      logIndex,
      commitment,
      leaf,
      leafIndex,
      transactionId,
      blockId,
      chainId,
      pool {
        id,
        address,
        denomination,
        asset
      }
    }
  }
}`,
  LEAVES_UNDER_POOL: gql`
query LeavesUnderPool($poolId: String!) {
  deposits(where: {
    poolId: $poolId
  }, orderBy: "leafIndex", orderDirection: "asc") {
    items {
      leaf
    }
  }
}`,
  DEPOSIT_AT: gql`
query DepositAt($poolId: String!, $leafIndex: BigInt!) {
  deposits(where: {
    poolId: $poolId
    leafIndex: $leafIndex
  }) {
    items {
      leafIndex,
      pool {
        id
        address
        chainId
      }
    }
  }
}`,
  WITHDRAWAL_AT: gql`
query WithdrawalAt($poolId: String!, $nullifier: String!) {
  withdrawals(where: {
    poolId: $poolId,
    nullifier: $nullifier
  }) {
    items {
      nullifier,
      pool {
        id
        address
        chainId
      },
      transaction {
        hash
      }
    }
  }
}`,
}

export type AllPoolsUnderAssetQuery = {
  privacyPools: {
    items: {
      address: Hex
      denomination: string
    }[]
  }
}

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

export type KnownCommitmentsResponse = { deposits: { items: Deposit[] } }

export type QueryKey = keyof typeof queries

export type ChainStatus = {
  ready: boolean;
  block: {
    timestamp: number;
    number: number;
  }
}

export type Status = {
  pulsechainV4: ChainStatus;
}

export type StatusResponse = { _meta: { status: Status } }

export type AllKnownLeavesResponse = { deposits: { items: { leaf: Hex }[] } }


export type DepositInfo = {
  leafIndex: number
  pool: {
    id: Hex
    address: Hex
    chainId: number
  }
}

export type DepositAtResponse = {
  deposits: {
    items: DepositInfo[]
  },
}

export type WithdrawalInfo = {
  nullifier: Hex
  transaction: {
    hash: Hex
  }
}

export type WithdrawalAtResponse = {
  withdrawals: {
    items: WithdrawalInfo[]
  }
}
