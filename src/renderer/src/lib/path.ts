export type Path = `m/44'/60'/${string}`
export enum PathTypes {
  BIP44,
  LedgerLive,
  LedgerLegacy,
}
export type IndexToPathFormer = {
  path: (index: '' | number) => Path
}
export const paths = new Map<PathTypes, IndexToPathFormer>([
  [PathTypes.BIP44, { path: (idx) => `m/44'/60'/0'/0/${idx}` }],
  [PathTypes.LedgerLive, { path: (idx) => `m/44'/60'/${idx}/0/0` }],
  [PathTypes.LedgerLegacy, { path: (idx) => `m/44'/60'/0'/${idx}` }],
])
