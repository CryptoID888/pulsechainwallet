import { derived, readable } from 'svelte/store'
// import { getDB } from '$lib/db'
type Proof = {
  pool_id: string
  leaf_index: number
  calldata: string
  message_hash: string | null
  work_state: string
  last_work_broadcast_time: string | null
  last_work_activity_time: string | null
}

export const proofs = readable<Proof[]>([], (set) => {
  const check = async () => {
    // const db = await getDB()!
    // if (!db) return
    // limit to 10 so that downstream processing doesn't get out of hand
    // const proofs = (await db.select('SELECT * from proof ORDER BY created_at ASC LIMIT 10')) as Proof[]
    // set(proofs)
  }
  const id = setInterval(check, 1000)
  return () => clearInterval(id)
})

export const workingProofs = derived([proofs], ([$proofs]) => $proofs.filter((proof) => proof.work_state === 'working'))
