import { derived } from 'svelte/store'
import _ from 'lodash'

import type { Proof } from '$common/pools'
import { readable, derived as derivedSlave } from '$lib/event-store'
import * as api from '$lib/api'

export const proofs = readable('proof', () => (
  api.proof.all()
), [])

export const nullifiedProofs = derivedSlave(null, [proofs], ([$proofs]) => (
  $proofs.filter((proof) => proof.work_state === 'nullified')
), [])

export const proofsCurrently = ($proofs: Proof[], state: string) => (
  ($proofs || []).filter((proof) => proof.work_state === state)
)

export const leafIndices = ($proofs: Proof[]) => (
  $proofs.map((proof) => BigInt(proof.leaf_index))
)

export const proofsUnderPool = derived([proofs], ([$proofs]) => (
  _.groupBy($proofs, 'pool_id')
))
