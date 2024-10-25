CREATE TABLE IF NOT EXISTS wallet(
  id TEXT PRIMARY KEY,
  -- apply order to the table
  user_order INTEGER NOT NULL,
  -- the index of the address currently being used
  address_index INTEGER NOT NULL,
  -- type of the seed - pk, phrase, read-only
  type TEXT NOT NULL,
  -- path type - m/44'/60'/0'/0/0
  path_type INTEGER NOT NULL,
  -- decrypted secret -- bad idea to let anyone see this
  encrypted JSONB NOT NULL,
  -- name provided by the user
  name TEXT
);
