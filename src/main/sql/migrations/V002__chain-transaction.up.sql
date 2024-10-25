CREATE TABLE IF NOT EXISTS chain_transaction(
  hash TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  PRIMARY KEY (hash, chain_id)
);
