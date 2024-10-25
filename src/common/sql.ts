
export const queries = {
  // wallet
  WALLET_INSERT: `
INSERT INTO wallet (id, name, user_order, address_index, type, path_type, encrypted)
VALUES (@id, @name, @user_order, @address_index, @type, @path_type, @encrypted)`,
  WALLET_UPDATE: `
UPDATE wallet SET name = @name
WHERE id = @id`,
  WALLET_COUNT: `
SELECT COUNT(*) as count FROM wallet`,
  // proof + work queries
  UPDATE_WORK_STATE: `
UPDATE proof SET work_state = @work_state
WHERE pool_id = @pool_id AND leaf_index = @leaf_index`,
  RESET_WORK_STATE: `
UPDATE proof SET work_state = 'waiting', last_work_activity_time = null
WHERE pool_id = @pool_id AND leaf_index = @leaf_index`,
  UPDATE_WORK_ACTIVITY: `
UPDATE proof SET last_work_activity_time = CURRENT_TIMESTAMP
WHERE pool_id = @pool_id AND leaf_index = @leaf_index`,
  UPDATE_MSG_ID: `
UPDATE proof SET message_hash = @message_hash, last_work_broadcast_time = CURRENT_TIMESTAMP
WHERE pool_id = @pool_id AND leaf_index = @leaf_index`,
  WALLET_ALL: `
SELECT user_order, id, name, address_index, type, path_type
FROM wallet`,
  // account queries
  ACCOUNT_INSERT: `
INSERT INTO account (wallet_id, address, address_index, name, added)
VALUES (@wallet_id, @address, @address_index, @name, @added)`,
  ACCOUNT_UPDATE_ADDED: `
UPDATE account SET added = @added
WHERE wallet_id = @wallet_id AND address_index = @address_index`,
  ACCOUNT_UPDATE_NAME: `
UPDATE account SET name = @name
WHERE wallet_id = @wallet_id AND address_index = @address_index`,
  ACCOUNT_GET: `
SELECT *
FROM account
WHERE wallet_id = @wallet_id AND address_index = @address_index`,
  ACCOUNT_ALL: `
SELECT *
FROM account`,
  ALL_ACCOUNTS_UNDER: `
SELECT *
FROM account
WHERE wallet_id = @id`,
  ACCOUNT_NULLIFY_ADDED: `
UPDATE account SET added = false
WHERE wallet_id = @wallet_id`,
  ACCOUNT_SET_ADDED: `
UPDATE account SET added = true
WHERE wallet_id = @wallet_id AND address_index = @address_index`,
  // contact queries
  CONTACT_INSERT: `
INSERT INTO contact (address, name) VALUES (@address, @name)`,
  CONTACT_GET: `
SELECT * FROM contact WHERE address = @address`,
  CHAIN_TRANSACTION_INSERT: `
INSERT INTO chain_transaction (hash, chain_id, action)
VALUES (@hash, @chain_id, @action)
ON CONFLICT (hash, chain_id) DO NOTHING`,
  ALL_TRANSACTIONS: `
SELECT * FROM chain_transaction`,
}

export const backendOnlyQueries = {
  WALLET_GET: `
SELECT * FROM wallet WHERE id = @id`,
  // proof queries
  INSERT_PROOF: `
INSERT INTO proof(pool_id, leaf_index, calldata, work_state)
VALUES (@pool_id, @leaf_index, @calldata, @work_state)`,
}

export type QueryKeys = keyof typeof queries
export type BackendOnlyQueryKeys = keyof typeof backendOnlyQueries
export type AllQueryKeys = QueryKeys | BackendOnlyQueryKeys

