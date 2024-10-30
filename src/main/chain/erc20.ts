import * as viem from 'viem'
import * as types from '$common/types'

export type Erc20Metadata = [string, string, number]

export const erc20MetadataCalls = [{ functionName: 'name' }, { functionName: 'symbol' }, { functionName: 'decimals' }]

export const multicallRead = async <T>({
  chain,
  client,
  abi,
  calls,
  target,
}: {
  chain: viem.Chain
  client?: viem.PublicClient
  abi: viem.Abi
  calls: types.Call[]
  target?: viem.Hex
}) => {
  const c =
    client ||
    viem.createPublicClient({
      chain,
      transport: viem.http(chain.rpcUrls.default.http[0]),
    })
  const multicall = viem.getContract({
    abi: viem.multicall3Abi,
    address: chain.contracts!.multicall3!.address!,
    client: c,
  })
  const arg = calls.map((call) => ({
    callData: viem.encodeFunctionData({
      abi: call.abi || abi,
      functionName: call.functionName,
      args: call.args || [],
    }),
    allowFailure: call.allowFailure || false,
    target: (call.target || target) as viem.Hex,
  }))
  let reads: null | Awaited<ReturnType<typeof multicall.read.aggregate3>> = null
  try {
    reads = await multicall.read.aggregate3([arg])
    if (!reads) throw reads
    const r = reads
    return calls.map((call, i) =>
      call.allowFailure
        ? r[i].success
          ? viem.decodeFunctionResult({
            abi: call.abi || abi,
            functionName: call.functionName,
            data: r[i].returnData,
          })
          : r[i].returnData
        : viem.decodeFunctionResult({
          abi: call.abi || abi,
          functionName: call.functionName,
          data: r[i].returnData,
        }),
    ) as T
  } catch (err) {
    console.log(target, calls, reads)
    throw err
  }
}

export const multicallErc20 = async ({
  client,
  target,
  chain,
}: {
  client?: viem.PublicClient
  target: viem.Hex
  chain: viem.Chain
}) => {
  const options = {
    chain: chain,
    client: client,
    abi: viem.erc20Abi,
    target,
    calls: erc20MetadataCalls,
  }
  try {
    return await multicallRead<Erc20Metadata>(options)
  } catch (err: unknown) {
    console.log(err)
    return await multicallRead<Erc20Metadata>({
      ...options,
      abi: viem.erc20Abi_bytes32,
    })
  }
}

export const erc20 = (opts: { address: viem.Hex; chain: viem.Chain; client?: viem.PublicClient }) => {
  const c =
    opts.client ||
    viem.createPublicClient({
      chain: opts.chain,
      transport: viem.http(opts.chain.rpcUrls.default.http[0]),
    })
  return viem.getContract({
    abi: viem.erc20Abi,
    ...opts,
    client: c,
  })
}
