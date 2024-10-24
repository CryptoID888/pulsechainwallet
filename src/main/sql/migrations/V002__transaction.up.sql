CREATE TABLE IF NOT EXISTS transaction_request(
  chain_id INTEGER NOT NULL,
  hash TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY(chain_id, hash)
);
