CREATE TABLE IF NOT EXISTS proof(
  chain_id INTEGER NOT NULL,
  -- the pool id which is created by hashing the chain id a known string and pool address
  -- doubles as the category for the msgboard
  pool_id TEXT NOT NULL,
  -- the leaf index (path) needs to be able to handle up to 2^20-1
  leaf_index INTEGER NOT NULL,
  -- the proof calldata. call the verifyWithdrawal function directly with this calldata
  -- this is null to start because we don't want to pay for the compute to verify the proof until it is actually needed
  calldata TEXT,
  -- the encrypted secret used to generate the proof
  secret TEXT NOT NULL,
  -- the user defined inputs for the proof. this is a json object containing a partial of the recipient, refund, relayer, fee, deadline
  user_inputs TEXT NOT NULL,
  -- a keyword that links to the access list that the proof should use
  access_list TEXT,
  -- state of the proof's work and it getting broadcast and eventually mined
  -- waiting: waiting to be broadcast - worker must respect max work bandwidth
  -- working: looking for valid work to put on msgboard. at this point, we have a valid proof
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
