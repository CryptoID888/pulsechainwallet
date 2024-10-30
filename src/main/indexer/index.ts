import * as graphqlRequest from 'graphql-request'
import { get } from 'svelte/store'
import { config } from '$main/config'
import { type QueryKey, allPoolsUnderChainId, queries } from '$common/indexer'
import { fetchStatus } from './store'
import type { Query } from '$common/indexer/gql/graphql'
import { handle } from '$main/ipc'

let client: graphqlRequest.GraphQLClient | null = null
let id: NodeJS.Timeout | null = null

export const start = () => {
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

export const query = async (queryKey: QueryKey, vars?: object) => {
  // return null as unknown as T
  return await client!.request<Query>(queries[queryKey], vars)
}

handle('indexer:start', start)
handle('indexer:stop', stop)
handle('indexer:restart', restart)

handle('indexer:query', query)
handle('indexer:query:allPoolsUnderChainId', allPoolsUnderChainId)
