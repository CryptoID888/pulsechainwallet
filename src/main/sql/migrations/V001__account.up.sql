CREATE TABLE IF NOT EXISTS account(
  -- id of the wallet the account belongs to
  wallet_id TEXT NOT NULL,
  -- address of the account
  address TEXT NOT NULL,
  -- index of the account in the wallet
  address_index INTEGER NOT NULL,
  -- whether the account should be accessible as a signer to the front end
  added boolean,
  -- because a wallet and a private key of one of the accounts can have the same address
  PRIMARY KEY (address, wallet_id)
);
