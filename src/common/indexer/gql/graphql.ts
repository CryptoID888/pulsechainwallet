/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Block = {
  __typename?: 'Block';
  chain: Chain;
  chainId: Scalars['Int']['output'];
  deposits?: Maybe<DepositPage>;
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  number: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
  withdrawals?: Maybe<WithdrawalPage>;
};


export type BlockDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type BlockWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type BlockFilter = {
  AND?: InputMaybe<Array<InputMaybe<BlockFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<BlockFilter>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  number?: InputMaybe<Scalars['BigInt']['input']>;
  number_gt?: InputMaybe<Scalars['BigInt']['input']>;
  number_gte?: InputMaybe<Scalars['BigInt']['input']>;
  number_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  number_lt?: InputMaybe<Scalars['BigInt']['input']>;
  number_lte?: InputMaybe<Scalars['BigInt']['input']>;
  number_not?: InputMaybe<Scalars['BigInt']['input']>;
  number_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type BlockPage = {
  __typename?: 'BlockPage';
  items: Array<Block>;
  pageInfo: PageInfo;
};

export type Chain = {
  __typename?: 'Chain';
  blocks?: Maybe<BlockPage>;
  deposits?: Maybe<DepositPage>;
  id: Scalars['Int']['output'];
  privacyPools?: Maybe<PrivacyPoolPage>;
  transactions?: Maybe<TransactionPage>;
  withdrawals?: Maybe<WithdrawalPage>;
};


export type ChainBlocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BlockFilter>;
};


export type ChainDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type ChainPrivacyPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PrivacyPoolFilter>;
};


export type ChainTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransactionFilter>;
};


export type ChainWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type ChainFilter = {
  AND?: InputMaybe<Array<InputMaybe<ChainFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ChainFilter>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_gt?: InputMaybe<Scalars['Int']['input']>;
  id_gte?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_lt?: InputMaybe<Scalars['Int']['input']>;
  id_lte?: InputMaybe<Scalars['Int']['input']>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type ChainPage = {
  __typename?: 'ChainPage';
  items: Array<Chain>;
  pageInfo: PageInfo;
};

export type Deposit = {
  __typename?: 'Deposit';
  block: Block;
  blockId: Scalars['String']['output'];
  chain: Chain;
  chainId: Scalars['Int']['output'];
  commitment: Scalars['String']['output'];
  id: Scalars['String']['output'];
  leaf: Scalars['String']['output'];
  leafIndex: Scalars['BigInt']['output'];
  logIndex: Scalars['Int']['output'];
  pool: PrivacyPool;
  poolId: Scalars['String']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
};

export type DepositFilter = {
  AND?: InputMaybe<Array<InputMaybe<DepositFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DepositFilter>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  commitment?: InputMaybe<Scalars['String']['input']>;
  commitment_gt?: InputMaybe<Scalars['String']['input']>;
  commitment_gte?: InputMaybe<Scalars['String']['input']>;
  commitment_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commitment_lt?: InputMaybe<Scalars['String']['input']>;
  commitment_lte?: InputMaybe<Scalars['String']['input']>;
  commitment_not?: InputMaybe<Scalars['String']['input']>;
  commitment_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leaf?: InputMaybe<Scalars['String']['input']>;
  leafIndex?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  leafIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  leaf_gt?: InputMaybe<Scalars['String']['input']>;
  leaf_gte?: InputMaybe<Scalars['String']['input']>;
  leaf_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leaf_lt?: InputMaybe<Scalars['String']['input']>;
  leaf_lte?: InputMaybe<Scalars['String']['input']>;
  leaf_not?: InputMaybe<Scalars['String']['input']>;
  leaf_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_gt?: InputMaybe<Scalars['String']['input']>;
  transactionId_gte?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_lt?: InputMaybe<Scalars['String']['input']>;
  transactionId_lte?: InputMaybe<Scalars['String']['input']>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DepositPage = {
  __typename?: 'DepositPage';
  items: Array<Deposit>;
  pageInfo: PageInfo;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PrivacyPool = {
  __typename?: 'PrivacyPool';
  address: Scalars['String']['output'];
  asset: Scalars['String']['output'];
  block: Block;
  blockId: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  currentOutstandingCount: Scalars['Int']['output'];
  denomination: Scalars['BigInt']['output'];
  deposits?: Maybe<DepositPage>;
  highestOutstandingCount: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  leafIndex: Scalars['BigInt']['output'];
  poolIndex: Scalars['Int']['output'];
  power: Scalars['Int']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
  withdrawals?: Maybe<WithdrawalPage>;
};


export type PrivacyPoolDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type PrivacyPoolWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type PrivacyPoolFilter = {
  AND?: InputMaybe<Array<InputMaybe<PrivacyPoolFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PrivacyPoolFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentOutstandingCount?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_gt?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_gte?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentOutstandingCount_lt?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_lte?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_not?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  denomination?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_gt?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_gte?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  denomination_lt?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_lte?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_not?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  highestOutstandingCount?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_gt?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_gte?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  highestOutstandingCount_lt?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_lte?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_not?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leafIndex?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  leafIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  poolIndex?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  poolIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_not?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  power?: InputMaybe<Scalars['Int']['input']>;
  power_gt?: InputMaybe<Scalars['Int']['input']>;
  power_gte?: InputMaybe<Scalars['Int']['input']>;
  power_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  power_lt?: InputMaybe<Scalars['Int']['input']>;
  power_lte?: InputMaybe<Scalars['Int']['input']>;
  power_not?: InputMaybe<Scalars['Int']['input']>;
  power_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_gt?: InputMaybe<Scalars['String']['input']>;
  transactionId_gte?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_lt?: InputMaybe<Scalars['String']['input']>;
  transactionId_lte?: InputMaybe<Scalars['String']['input']>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PrivacyPoolPage = {
  __typename?: 'PrivacyPoolPage';
  items: Array<PrivacyPool>;
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  _meta?: Maybe<_Meta>;
  block?: Maybe<Block>;
  blocks: BlockPage;
  chain?: Maybe<Chain>;
  chains: ChainPage;
  deposit?: Maybe<Deposit>;
  deposits: DepositPage;
  privacyPool?: Maybe<PrivacyPool>;
  privacyPools: PrivacyPoolPage;
  transaction?: Maybe<Transaction>;
  transactions: TransactionPage;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: WithdrawalPage;
};


export type QueryBlockArgs = {
  id: Scalars['String']['input'];
};


export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BlockFilter>;
};


export type QueryChainArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChainsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ChainFilter>;
};


export type QueryDepositArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type QueryPrivacyPoolArgs = {
  id: Scalars['String']['input'];
};


export type QueryPrivacyPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PrivacyPoolFilter>;
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransactionFilter>;
};


export type QueryWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type Transaction = {
  __typename?: 'Transaction';
  block: Block;
  blockId: Scalars['String']['output'];
  chain: Chain;
  chainId: Scalars['Int']['output'];
  deposits?: Maybe<DepositPage>;
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  privacyPools?: Maybe<PrivacyPoolPage>;
  withdrawals?: Maybe<WithdrawalPage>;
};


export type TransactionDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type TransactionPrivacyPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PrivacyPoolFilter>;
};


export type TransactionWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type TransactionFilter = {
  AND?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  index?: InputMaybe<Scalars['Int']['input']>;
  index_gt?: InputMaybe<Scalars['Int']['input']>;
  index_gte?: InputMaybe<Scalars['Int']['input']>;
  index_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  index_lt?: InputMaybe<Scalars['Int']['input']>;
  index_lte?: InputMaybe<Scalars['Int']['input']>;
  index_not?: InputMaybe<Scalars['Int']['input']>;
  index_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type TransactionPage = {
  __typename?: 'TransactionPage';
  items: Array<Transaction>;
  pageInfo: PageInfo;
};

export type Withdrawal = {
  __typename?: 'Withdrawal';
  block: Block;
  blockId: Scalars['String']['output'];
  chain: Chain;
  chainId: Scalars['Int']['output'];
  fee: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  nullifier: Scalars['String']['output'];
  pool: PrivacyPool;
  poolId: Scalars['String']['output'];
  recipient: Scalars['String']['output'];
  relayer: Scalars['String']['output'];
  subsetRoot: Scalars['String']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
};

export type WithdrawalFilter = {
  AND?: InputMaybe<Array<InputMaybe<WithdrawalFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WithdrawalFilter>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  fee?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  fee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nullifier?: InputMaybe<Scalars['String']['input']>;
  nullifier_gt?: InputMaybe<Scalars['String']['input']>;
  nullifier_gte?: InputMaybe<Scalars['String']['input']>;
  nullifier_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nullifier_lt?: InputMaybe<Scalars['String']['input']>;
  nullifier_lte?: InputMaybe<Scalars['String']['input']>;
  nullifier_not?: InputMaybe<Scalars['String']['input']>;
  nullifier_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  recipient_gt?: InputMaybe<Scalars['String']['input']>;
  recipient_gte?: InputMaybe<Scalars['String']['input']>;
  recipient_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  recipient_lt?: InputMaybe<Scalars['String']['input']>;
  recipient_lte?: InputMaybe<Scalars['String']['input']>;
  recipient_not?: InputMaybe<Scalars['String']['input']>;
  recipient_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  relayer?: InputMaybe<Scalars['String']['input']>;
  relayer_gt?: InputMaybe<Scalars['String']['input']>;
  relayer_gte?: InputMaybe<Scalars['String']['input']>;
  relayer_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  relayer_lt?: InputMaybe<Scalars['String']['input']>;
  relayer_lte?: InputMaybe<Scalars['String']['input']>;
  relayer_not?: InputMaybe<Scalars['String']['input']>;
  relayer_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subsetRoot?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_gt?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_gte?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subsetRoot_lt?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_lte?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_not?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_gt?: InputMaybe<Scalars['String']['input']>;
  transactionId_gte?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_lt?: InputMaybe<Scalars['String']['input']>;
  transactionId_lte?: InputMaybe<Scalars['String']['input']>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type WithdrawalPage = {
  __typename?: 'WithdrawalPage';
  items: Array<Withdrawal>;
  pageInfo: PageInfo;
};

export type _Meta = {
  __typename?: '_meta';
  status?: Maybe<Scalars['JSON']['output']>;
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Block = {
  __typename?: 'Block';
  chain: Chain;
  chainId: Scalars['Int']['output'];
  deposits?: Maybe<DepositPage>;
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  number: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
  withdrawals?: Maybe<WithdrawalPage>;
};


export type BlockDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type BlockWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type BlockFilter = {
  AND?: InputMaybe<Array<InputMaybe<BlockFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<BlockFilter>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  number?: InputMaybe<Scalars['BigInt']['input']>;
  number_gt?: InputMaybe<Scalars['BigInt']['input']>;
  number_gte?: InputMaybe<Scalars['BigInt']['input']>;
  number_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  number_lt?: InputMaybe<Scalars['BigInt']['input']>;
  number_lte?: InputMaybe<Scalars['BigInt']['input']>;
  number_not?: InputMaybe<Scalars['BigInt']['input']>;
  number_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type BlockPage = {
  __typename?: 'BlockPage';
  items: Array<Block>;
  pageInfo: PageInfo;
};

export type Chain = {
  __typename?: 'Chain';
  blocks?: Maybe<BlockPage>;
  deposits?: Maybe<DepositPage>;
  id: Scalars['Int']['output'];
  privacyPools?: Maybe<PrivacyPoolPage>;
  transactions?: Maybe<TransactionPage>;
  withdrawals?: Maybe<WithdrawalPage>;
};


export type ChainBlocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BlockFilter>;
};


export type ChainDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type ChainPrivacyPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PrivacyPoolFilter>;
};


export type ChainTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransactionFilter>;
};


export type ChainWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type ChainFilter = {
  AND?: InputMaybe<Array<InputMaybe<ChainFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ChainFilter>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_gt?: InputMaybe<Scalars['Int']['input']>;
  id_gte?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_lt?: InputMaybe<Scalars['Int']['input']>;
  id_lte?: InputMaybe<Scalars['Int']['input']>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type ChainPage = {
  __typename?: 'ChainPage';
  items: Array<Chain>;
  pageInfo: PageInfo;
};

export type Deposit = {
  __typename?: 'Deposit';
  block: Block;
  blockId: Scalars['String']['output'];
  chain: Chain;
  chainId: Scalars['Int']['output'];
  commitment: Scalars['String']['output'];
  id: Scalars['String']['output'];
  leaf: Scalars['String']['output'];
  leafIndex: Scalars['BigInt']['output'];
  logIndex: Scalars['Int']['output'];
  pool: PrivacyPool;
  poolId: Scalars['String']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
};

export type DepositFilter = {
  AND?: InputMaybe<Array<InputMaybe<DepositFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DepositFilter>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  commitment?: InputMaybe<Scalars['String']['input']>;
  commitment_gt?: InputMaybe<Scalars['String']['input']>;
  commitment_gte?: InputMaybe<Scalars['String']['input']>;
  commitment_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commitment_lt?: InputMaybe<Scalars['String']['input']>;
  commitment_lte?: InputMaybe<Scalars['String']['input']>;
  commitment_not?: InputMaybe<Scalars['String']['input']>;
  commitment_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leaf?: InputMaybe<Scalars['String']['input']>;
  leafIndex?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  leafIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  leaf_gt?: InputMaybe<Scalars['String']['input']>;
  leaf_gte?: InputMaybe<Scalars['String']['input']>;
  leaf_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leaf_lt?: InputMaybe<Scalars['String']['input']>;
  leaf_lte?: InputMaybe<Scalars['String']['input']>;
  leaf_not?: InputMaybe<Scalars['String']['input']>;
  leaf_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_gt?: InputMaybe<Scalars['String']['input']>;
  transactionId_gte?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_lt?: InputMaybe<Scalars['String']['input']>;
  transactionId_lte?: InputMaybe<Scalars['String']['input']>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DepositPage = {
  __typename?: 'DepositPage';
  items: Array<Deposit>;
  pageInfo: PageInfo;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PrivacyPool = {
  __typename?: 'PrivacyPool';
  address: Scalars['String']['output'];
  asset: Scalars['String']['output'];
  block: Block;
  blockId: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  currentOutstandingCount: Scalars['Int']['output'];
  denomination: Scalars['BigInt']['output'];
  deposits?: Maybe<DepositPage>;
  highestOutstandingCount: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  leafIndex: Scalars['BigInt']['output'];
  poolIndex: Scalars['Int']['output'];
  power: Scalars['Int']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
  withdrawals?: Maybe<WithdrawalPage>;
};


export type PrivacyPoolDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type PrivacyPoolWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type PrivacyPoolFilter = {
  AND?: InputMaybe<Array<InputMaybe<PrivacyPoolFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PrivacyPoolFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentOutstandingCount?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_gt?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_gte?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentOutstandingCount_lt?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_lte?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_not?: InputMaybe<Scalars['Int']['input']>;
  currentOutstandingCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  denomination?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_gt?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_gte?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  denomination_lt?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_lte?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_not?: InputMaybe<Scalars['BigInt']['input']>;
  denomination_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  highestOutstandingCount?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_gt?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_gte?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  highestOutstandingCount_lt?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_lte?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_not?: InputMaybe<Scalars['Int']['input']>;
  highestOutstandingCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leafIndex?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  leafIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  leafIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  poolIndex?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  poolIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_not?: InputMaybe<Scalars['Int']['input']>;
  poolIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  power?: InputMaybe<Scalars['Int']['input']>;
  power_gt?: InputMaybe<Scalars['Int']['input']>;
  power_gte?: InputMaybe<Scalars['Int']['input']>;
  power_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  power_lt?: InputMaybe<Scalars['Int']['input']>;
  power_lte?: InputMaybe<Scalars['Int']['input']>;
  power_not?: InputMaybe<Scalars['Int']['input']>;
  power_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_gt?: InputMaybe<Scalars['String']['input']>;
  transactionId_gte?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_lt?: InputMaybe<Scalars['String']['input']>;
  transactionId_lte?: InputMaybe<Scalars['String']['input']>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PrivacyPoolPage = {
  __typename?: 'PrivacyPoolPage';
  items: Array<PrivacyPool>;
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  _meta?: Maybe<_Meta>;
  block?: Maybe<Block>;
  blocks: BlockPage;
  chain?: Maybe<Chain>;
  chains: ChainPage;
  deposit?: Maybe<Deposit>;
  deposits: DepositPage;
  privacyPool?: Maybe<PrivacyPool>;
  privacyPools: PrivacyPoolPage;
  transaction?: Maybe<Transaction>;
  transactions: TransactionPage;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: WithdrawalPage;
};


export type QueryBlockArgs = {
  id: Scalars['String']['input'];
};


export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BlockFilter>;
};


export type QueryChainArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChainsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ChainFilter>;
};


export type QueryDepositArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type QueryPrivacyPoolArgs = {
  id: Scalars['String']['input'];
};


export type QueryPrivacyPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PrivacyPoolFilter>;
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransactionFilter>;
};


export type QueryWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type Transaction = {
  __typename?: 'Transaction';
  block: Block;
  blockId: Scalars['String']['output'];
  chain: Chain;
  chainId: Scalars['Int']['output'];
  deposits?: Maybe<DepositPage>;
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  privacyPools?: Maybe<PrivacyPoolPage>;
  withdrawals?: Maybe<WithdrawalPage>;
};


export type TransactionDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type TransactionPrivacyPoolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PrivacyPoolFilter>;
};


export type TransactionWithdrawalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawalFilter>;
};

export type TransactionFilter = {
  AND?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  index?: InputMaybe<Scalars['Int']['input']>;
  index_gt?: InputMaybe<Scalars['Int']['input']>;
  index_gte?: InputMaybe<Scalars['Int']['input']>;
  index_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  index_lt?: InputMaybe<Scalars['Int']['input']>;
  index_lte?: InputMaybe<Scalars['Int']['input']>;
  index_not?: InputMaybe<Scalars['Int']['input']>;
  index_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type TransactionPage = {
  __typename?: 'TransactionPage';
  items: Array<Transaction>;
  pageInfo: PageInfo;
};

export type Withdrawal = {
  __typename?: 'Withdrawal';
  block: Block;
  blockId: Scalars['String']['output'];
  chain: Chain;
  chainId: Scalars['Int']['output'];
  fee: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  nullifier: Scalars['String']['output'];
  pool: PrivacyPool;
  poolId: Scalars['String']['output'];
  recipient: Scalars['String']['output'];
  relayer: Scalars['String']['output'];
  subsetRoot: Scalars['String']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
};

export type WithdrawalFilter = {
  AND?: InputMaybe<Array<InputMaybe<WithdrawalFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WithdrawalFilter>>>;
  blockId?: InputMaybe<Scalars['String']['input']>;
  blockId_gt?: InputMaybe<Scalars['String']['input']>;
  blockId_gte?: InputMaybe<Scalars['String']['input']>;
  blockId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockId_lt?: InputMaybe<Scalars['String']['input']>;
  blockId_lte?: InputMaybe<Scalars['String']['input']>;
  blockId_not?: InputMaybe<Scalars['String']['input']>;
  blockId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  fee?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  fee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nullifier?: InputMaybe<Scalars['String']['input']>;
  nullifier_gt?: InputMaybe<Scalars['String']['input']>;
  nullifier_gte?: InputMaybe<Scalars['String']['input']>;
  nullifier_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nullifier_lt?: InputMaybe<Scalars['String']['input']>;
  nullifier_lte?: InputMaybe<Scalars['String']['input']>;
  nullifier_not?: InputMaybe<Scalars['String']['input']>;
  nullifier_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  recipient?: InputMaybe<Scalars['String']['input']>;
  recipient_gt?: InputMaybe<Scalars['String']['input']>;
  recipient_gte?: InputMaybe<Scalars['String']['input']>;
  recipient_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  recipient_lt?: InputMaybe<Scalars['String']['input']>;
  recipient_lte?: InputMaybe<Scalars['String']['input']>;
  recipient_not?: InputMaybe<Scalars['String']['input']>;
  recipient_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  relayer?: InputMaybe<Scalars['String']['input']>;
  relayer_gt?: InputMaybe<Scalars['String']['input']>;
  relayer_gte?: InputMaybe<Scalars['String']['input']>;
  relayer_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  relayer_lt?: InputMaybe<Scalars['String']['input']>;
  relayer_lte?: InputMaybe<Scalars['String']['input']>;
  relayer_not?: InputMaybe<Scalars['String']['input']>;
  relayer_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subsetRoot?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_gt?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_gte?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subsetRoot_lt?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_lte?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_not?: InputMaybe<Scalars['String']['input']>;
  subsetRoot_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_gt?: InputMaybe<Scalars['String']['input']>;
  transactionId_gte?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_lt?: InputMaybe<Scalars['String']['input']>;
  transactionId_lte?: InputMaybe<Scalars['String']['input']>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type WithdrawalPage = {
  __typename?: 'WithdrawalPage';
  items: Array<Withdrawal>;
  pageInfo: PageInfo;
};

export type _Meta = {
  __typename?: '_meta';
  status?: Maybe<Scalars['JSON']['output']>;
};
