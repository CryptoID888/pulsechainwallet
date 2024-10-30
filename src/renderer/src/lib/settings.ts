// import { persisted } from 'svelte-persisted-store'

// export const maxDecimals = 18

// export const feeTypes = {
//   LEGACY: 'legacy',
//   EIP1559: 'eip1559',
// } as const

// export const enums = {
//   defaultTransactionFeeType: feeTypes,
// } as const

// export const feeTypesList = Object.values(feeTypes)

// export type FeeType = (typeof feeTypesList)[number]

// export const defaultSettings = {
//   /** the delimiter to use between numbers */
//   digitGroupSeparator: ',',
//   decimalSeparator: '.',
//   /** the number of decimals to show when number > 1 */
//   maxDelimiterSets: 3,
//   /** the number of characters to show for an address */
//   addressTruncation: 6,
//   /** the default transaction fee type, only eip1559 or legacy supported */
//   defaultTransactionFeeType: 'eip1559' as FeeType,
//   /** multiply the estimated gas limit to ensure sufficient gas */
//   defaultGasLimitMultiplier: 20_000,
//   /** if a transaction is not mined in a provided base fee range, resubmit the transaction */
//   autoReplaceUnderpriced: false,
//   /** show numbers as base 16 (false) or base 10 (true) */
//   numbersOverHex: false,
//   /** raises gas price (base fee) 1.125^n. this guarantees that the transaction will be valid for that many blocks */
//   baseFeeValidityRange: 6,
//   /** utilize some portion of the calculated base fee to calculate the priority fee */
//   defaultPriorityFeeAdditive: 1_000,
//   /** multiply the priority fee by pf * n / 10000 to get a new priority fee */
//   defaultPriorityFeeRetryAdditive: 1_000,
//   /** show testnets in the network dropdown */
//   showTestnets: false,
//   /** use iso when showing timestamps */
//   useISOTime: true,
// }

// export const settings = persisted('settings', defaultSettings, {
//   serializer: {
//     stringify: JSON.stringify,
//     parse: (txt) => {
//       return {
//         ...defaultSettings,
//         ...JSON.parse(txt),
//       } as typeof defaultSettings
//     },
//   },
// })
