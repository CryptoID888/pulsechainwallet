import { query, restart } from '.'
import { writable } from 'svelte/store'
import type { _Meta } from '$common/indexer/gql/graphql'

export const status = writable<_Meta["status"] | null>(null)

let statusFailedCounter = 0

export const fetchStatus = () => {
  query('STATUS')
    .catch(async (error) => {
      if (error.response?.status >= 500) {
        console.log('indexer status failed, retrying...')
        return await query('STATUS')
      }
      throw error
    })
    .then((data) => {
      if (statusFailedCounter > 0) {
        console.log('indexer status recovered')
        statusFailedCounter = 0
      }
      status.set(data?._meta?.status)
    })
    .catch(async (error) => {
      console.error('caught fetch status', error)
      statusFailedCounter++
      status.set(null)
      if (statusFailedCounter > 2) {
        await restart()
        statusFailedCounter = 0
      }
    })
}
