import * as graphqlRequest from 'graphql-request'
import { ipcMain } from 'electron'
import { get } from 'svelte/store'
import { config } from '$main/config'
import { type QueryKey, queries } from '$common/indexer'
import { fetchStatus } from './store'

let client: graphqlRequest.GraphQLClient | null = null
let id: NodeJS.Timeout | null = null

export const start = () => {
  console.log('starting indexer')
  client = new graphqlRequest.GraphQLClient(get(config).indexer.url)
  id = setInterval(() => fetchStatus(), 5_000)
}

export const stop = async () => {
  if (!client) {
    return false
  }
  client = null
  clearInterval(id!)
  id = null
  return true
}

export const restart = async () => {
  console.log('restarting indexer')
  await stop()
  start()
}

ipcMain.handle('indexer:start', start)
ipcMain.handle('indexer:stop', stop)
ipcMain.handle('indexer:restart', restart)

ipcMain.handle('indexer:query', async (_, q: QueryKey, vars?: object) => {
  if (!client) {
    throw new Error('Indexer not started')
  }
  const result = await query(q, vars)
  return result
})

export const query = async <T>(queryKey: QueryKey, vars?: object): Promise<T> => {
  // return null as unknown as T
  return await client!.request(queries[queryKey], vars)
}
