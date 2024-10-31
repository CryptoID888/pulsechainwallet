// let url = 'postgres://postgres:password@0.0.0.0:42070/pulsechainwallet'

// let _db: ReturnType<typeof Database.load> | null = null

// export const getDB = async () => {
//   _db = _db || Database.load(url)
//   return _db
// }

// export const updateDB = async (_url: string) => {
//   url = _url
//   _db = null
// }

// export const queries = {
//   UPDATE_WORK_STATE: `
// UPDATE proof SET work_state = $3
// WHERE pool_id = $1 AND leaf_index = $2`,
//   RESET_WORK_STATE: `
// UPDATE proof SET work_state = 'waiting', last_work_activity_time = null
// WHERE pool_id = $1 AND leaf_index = $2`,
//   UPDATE_WORK_ACTIVITY: `
// UPDATE proof SET last_work_activity_time = now()
// WHERE pool_id = $1 AND leaf_index = $2`,
//   UPDATE_MSG_ID: `
// UPDATE proof SET message_hash = $3, last_work_broadcast_time = now()
// WHERE pool_id = $1 AND leaf_index = $2`,
// }
