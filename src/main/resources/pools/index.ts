// import type { BigNumber } from '@ethersproject/bignumber'
// import * as snarkjs from 'snarkjs'
// import brotliPromise from 'brotli-wasm'
// import { solidityPackedKeccak256 } from 'ethers'
// import {
//   bytesToHex,
//   getAddress,
//   isAddress,
//   numberToHex,
//   toHex,
//   zeroAddress,
//   type Hex,
// } from 'viem'
// import { PrivacyPoolFactoryAbi } from '../../../common/abis/PrivacyPoolFactory'
// import { AccessList, poseidon, subsetDataToBytes, toFE, MerkleTree } from '../pools-ts'
// import { type Account } from '$common/wallets'
// import { methods as walletMethods } from '$main/wallets'
// import { fetchLeavesUnderPool, type Deposit } from '../../src/renderer/src/lib/ponder'
// import { getDB } from '$lib/db'
// import { derived, get } from 'svelte/store'
// import { chain } from '$lib/chain-state'
// import type { WithdrawalProofStruct } from '$lib/types'
// import { config } from '$main/config'
// import { native } from '$common/pools'

// let zkeyBytes!: Uint8Array
// let wasmBytes!: Uint8Array

// let brotli!: Awaited<typeof brotliPromise>

// export const init = async () => {
//   brotli = await brotliPromise
//   const WASM_FNAME = await path.join('resources', 'pools', 'withdraw_from_subset.wasm')
//   // await Command.create('ls', ['-la', resourceDir]).execute()
//   wasmBytes = await fs.readFile(WASM_FNAME, {
//     baseDir: fs.BaseDirectory.Resource,
//   })
//   const ZKEY_FNAME = await path.join('resources', 'pools', 'withdraw_from_subset_final.zkey')
//   zkeyBytes = await fs.readFile(ZKEY_FNAME, {
//     baseDir: fs.BaseDirectory.Resource,
//   })
//   const VERIFIER_FNAME = await path.join('resources', 'pools', 'withdraw_from_subset_verifier.json')
//   const verifierBytes = await fs.readFile(VERIFIER_FNAME, {
//     baseDir: fs.BaseDirectory.Resource,
//   })
//   const verifier = JSON.parse(new TextDecoder().decode(verifierBytes))
//   console.log(verifier)
//   // console.log('wasm=%o, zkey=%o', wasmBytes.length, zkeyBytes.length)
// }

// export const compress = async (bufferData: Uint8Array) => {
//   await brotliPromise
//   return bytesToHex(brotli.compress(bufferData))
//   // return bufferData
// }

// // type DepositToWithdraw = {
// //   path: string;
// //   secret: Hex;
// // }

// const asInt = (accessList: AccessList) => {
//   return accessList.accessType === 'allowlist' ? 1 : 0
// }

// export const generateAssetMetadata = (assetAddress: string, denomination: string | bigint) => (
//   hashMod(['address', 'uint256'], [assetAddress, denomination])
// )

// export const hashMod = (types: string[], values: unknown[]) => {
//   return toFE(BigInt(solidityPackedKeccak256(types, values)))
// }

// export const toHexString = (number: bigint | string | Hex) => {
//   return numberToHex(BigInt(number), { size: 32 })
// }

// type UserDefinedInputs = {
//   recipient: Hex
//   path: number
//   refund?: bigint
//   relayer?: Hex
//   fee?: bigint
//   deadline?: bigint
// }

// export const createProof = async (
//   secret: Hex,
//   assetAddress: Hex,
//   denomination: bigint,
//   depositTree: MerkleTree, accessList: AccessList,
//   userDefinedInputs: UserDefinedInputs,
// ) => {
//   // oldestLoneDeposit.secret -> commitment
//   // commitment -> proof
//   // proof -> WithdrawalStruct{proof}
//   const subsetBytes = subsetDataToBytes(accessList.subsetData)
//   const bufferData = Uint8Array.from(subsetBytes.data)
//   const subsetData = toHex(brotli.compress(bufferData))
//   // const subsetData = '0x'
//   const withdrawalData = {
//     accessType: asInt(accessList),
//     bitLength: subsetBytes.bitLength,
//     subsetData,
//     refund: 0n,
//     relayer: zeroAddress,
//     fee: 0n,
//     deadline: 0n,
//     ...userDefinedInputs,
//   } as const
//   const proof = depositTree.generateProof(withdrawalData.path)
//   if (!depositTree.verifyProof(proof)) {
//     throw new Error('proof verification failed')
//   }
//   const subsetProof = accessList.generateProof(withdrawalData.path)
//   const nullifier = poseidon([secret, 1n, `${withdrawalData.path}`])
//   const withdrawalKeys: (keyof typeof withdrawalData)[] = [
//     'recipient',
//     'refund',
//     'relayer',
//     'fee',
//     'deadline',
//     'accessType',
//     'bitLength',
//     'subsetData',
//   ]
//   const withdrawalValues = withdrawalKeys.map((k) => withdrawalData[k])
//   const withdrawMetadata = hashMod(
//     ['address', 'uint256', 'address', 'uint256', 'uint256', 'uint8', 'uint24', 'bytes'],
//     withdrawalValues,
//   )
//   const assetMetadata = generateAssetMetadata(getAddress(assetAddress), BigInt(denomination))
//   const input = {
//     root: toHexString(depositTree.root.toBigInt()),
//     subsetRoot: toHexString(accessList.root.toBigInt()),
//     nullifier: toHexString((nullifier as BigNumber).toBigInt()),
//     assetMetadata: assetMetadata.toHexString(),
//     withdrawMetadata: withdrawMetadata.toHexString(),
//     secret,
//     path: withdrawalData.path,
//     mainProof: proof.siblings.map((b) => b.toHexString()),
//     subsetProof: subsetProof.siblings.map((b) => b.toHexString())
//   }
//   const { proof: fullProof } = await snarkjs.groth16.fullProve(
//     input,
//     wasmBytes,
//     zkeyBytes,
//   )
//   const solidityInput = {
//     flatProof: [
//       fullProof.pi_a[0] as Hex,
//       fullProof.pi_a[1] as Hex,
//       fullProof.pi_b[0][1] as Hex,
//       fullProof.pi_b[0][0] as Hex,
//       fullProof.pi_b[1][1] as Hex,
//       fullProof.pi_b[1][0] as Hex,
//       fullProof.pi_c[0] as Hex,
//       fullProof.pi_c[1] as Hex,
//     ],
//     root: input.root,
//     subsetRoot: input.subsetRoot,
//     nullifier: input.nullifier,
//     ...withdrawalData,
//   }
//   const withdrawalStruct: WithdrawalProofStruct = {
//     accessType: toHex(solidityInput.accessType),
//     bitLength: toHex(solidityInput.bitLength),
//     subsetData: solidityInput.subsetData,
//     flatProof: solidityInput.flatProof as WithdrawalProofStruct['flatProof'],
//     root: solidityInput.root,
//     subsetRoot: solidityInput.subsetRoot,
//     nullifier: solidityInput.nullifier,
//     recipient: solidityInput.recipient,
//     refund: numberToHex(solidityInput.refund),
//     relayer: solidityInput.relayer,
//     fee: numberToHex(solidityInput.fee),
//     deadline: numberToHex(solidityInput.deadline),
//   }
//   return withdrawalStruct
// }

// export const generateProofs = async (account: Account, recipient: Hex, feePerCommitment: bigint, deposits: Deposit[]) => {
//   if (!account) return
//   if (!isAddress(recipient)) return
//   if (!deposits.length) return
//   const pool = deposits[0].pool
//   if (!pool) return
//   const secret = await walletMethods.secretFromAccountSignature(account, get(chain), pool.address)
//   if (!secret) return
//   const secretHex = numberToHex(secret.toBigInt(), { size: 32 })
//   const leaves = await fetchLeavesUnderPool(pool.id)
//   const depositTree = MerkleTree.fullEmpty({
//     treeLength: 0,
//     zeroString: 'empty',
//   })
//   for (const leaf of leaves) {
//     depositTree.insert(leaf)
//   }
//   // const depositTree = new MerkleTree(allDeposits.map((d) => d.leaf))
//   const blocklist = AccessList.fullEmpty({
//     accessType: 'blocklist',
//     subsetLength: depositTree.length,
//   })
//   const shared = {
//     recipient,
//     secret: secretHex,
//     fee: feePerCommitment,
//   } as const
//   const proofs = await Promise.all(deposits.map(async (deposit) => {
//     const calldata = await createProof(secretHex, pool.asset, pool.denomination, depositTree, blocklist, {
//       ...shared,
//       path: deposit.leafIndex,
//     })
//     return {
//       pool,
//       deposit,
//       calldata,
//       depositTree,
//     }
//   }))
//   return proofs
// }

// const bigintReplacer = (_key: string, value: unknown) => {
//   if (typeof value === 'bigint') {
//     return value.toString()
//   }
//   return value
// }

// export const cacheProofs = async (proofs: Awaited<ReturnType<typeof generateProofs>>) => {
//   if (!proofs) return
//   const db = await getDB()!
//   for (const { pool, calldata, deposit } of proofs) {
//     const calldataJson = JSON.stringify(calldata, bigintReplacer)
//     await db.execute(`
//         INSERT INTO proof(pool_id, leaf_index, calldata, work_state)
//         VALUES ($1, $2, $3, $4)
//       `,
//       [pool.id, +deposit.leafIndex, calldataJson, 'waiting'],
//     )
//   }
// }

// const allPossiblePowers = (new Array(79)).fill(0).map((_v, i) => BigInt(i))

// const allPossiblePowerCalls = allPossiblePowers.map((power) => ({
//   functionName: 'poolGroupByInput',
//   args: [native, power],
//   allowFailure: true,
// }))

// export const factoryAddress = derived([config], ([$config]) => {
//   if (!$config) return null
//   return $config.pools[$config.chainId]?.factory.address || null
// })

// export const allPools = derived([chain, factoryAddress], ([$chain, $factoryAddress], set) => {
//   if (!$chain || !$factoryAddress) return () => { }
//   let cancelled = false
//   multicallRead<Hex[][]>({
//     chain: $chain,
//     target: $factoryAddress,
//     abi: PrivacyPoolFactoryAbi,
//     calls: allPossiblePowerCalls,
//   }).then((res) => {
//     if (cancelled) return
//     const sanitized = res.filter((addrs) => addrs.filter((addr) => isAddress(addr)))
//     set(sanitized)
//   })
//   return () => {
//     cancelled = true
//   }
// }, [] as Hex[][])
