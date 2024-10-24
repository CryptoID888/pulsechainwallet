CREATE TABLE IF NOT EXISTS proof(
  pool_id TEXT NOT NULL, -- the pool id which is created by hashing the chain id a known string and pool address
  leaf_index INTEGER NOT NULL, -- the leaf index needs to be able to handle up to 2^20-1
  calldata TEXT NOT NULL, -- the proof
  -- state of the proof's work and it getting broadcast and eventually mined
  -- waiting: waiting to be broadcast - worker must respect max work bandwidth
  -- working: looking for valid work to put on msgboard
  -- broadcast: broadcasted to msgboard, should have a valid msgboard tx hash
  -- mined: the tx has been included in a block - proof should be either auto deleted or deleted by user
  -- failed / cancelled / expired - needs to be recreated / handled by user or configured to auto recreate
  work_state TEXT NOT NULL,
   -- last activity time from the worker
  last_work_activity_time TIMESTAMP,
   -- last broadcast time
  last_work_broadcast_time TIMESTAMP,
  message_hash TEXT, -- the message hash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  -- it would be nice to hash this to make for cleaner queries
  -- but this is fine for now
  PRIMARY KEY (pool_id, leaf_index)
);
