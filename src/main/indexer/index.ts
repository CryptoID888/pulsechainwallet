import * as graphqlRequest from 'graphql-request'
import { get } from 'svelte/store'
import _ from 'lodash'

import { config } from '$main/config'
import { type QueryKey, allDepositsFromCommitments, allPoolsUnderChainId, queries } from '$common/indexer'
import { fetchStatus } from '$main/indexer/store'
import type { Query, PageInfo } from '$common/indexer/gql/graphql'
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

type GenericPage<T> = { items: T[]; pageInfo: PageInfo }
const defaultPageInfo = () => ({ items: [], pageInfo: { hasNextPage: false, endCursor: null } })
export const loopQuery = async <T = unknown>(queryKey: QueryKey, accessKey: string, vars: object = {}) => {
  let hasNextPage = true
  const collection: T[][] = []
  let after: string | null = null
  while (hasNextPage) {
    const response = await query(queryKey, {
      ...vars,
      after,
    })
    const { items, pageInfo } = (_.get(response, accessKey) || defaultPageInfo()) as GenericPage<T>
    collection.push(items || [])
    hasNextPage = pageInfo?.hasNextPage || false
    after = pageInfo?.endCursor || null
  }
  // flatten once at the end
  return _.flatten(collection)
}

handle('indexer:start', start)
handle('indexer:stop', stop)
handle('indexer:restart', restart)

handle('indexer:query', query)
handle('indexer:query:allPoolsUnderChainId', allPoolsUnderChainId)
handle('indexer:query:allDepositsFromCommitments', allDepositsFromCommitments)
