import { query, restart } from '.'
import { writable } from 'svelte/store'
import { Status, StatusResponse } from '$common/indexer'

export const status = writable<Status | null>(null)

let statusFailedCounter = 0

export const fetchStatus = () => {
  query<StatusResponse>('STATUS')
    .catch(async (error) => {
      if (error.response?.status >= 500) {
        console.log('indexer status failed, retrying...')
        return await query<StatusResponse>('STATUS')
      }
      throw error
    })
    .then((data) => {
      if (statusFailedCounter > 0) {
        console.log('indexer status recovered')
        statusFailedCounter = 0
      }
      status.set(data._meta.status)
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
