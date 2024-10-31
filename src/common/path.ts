export type Path = `m/44'/60'/${string}`
export enum PathTypes {
  UNKNOWN,
  BIP44,
  LedgerLive,
  LedgerLegacy,
}
export type IndexToPathFormer = {
  path: (index: '' | number) => Path | null
}
export const paths = new Map<PathTypes, IndexToPathFormer>([
  [PathTypes.UNKNOWN, { path: () => null }],
  [PathTypes.BIP44, { path: (idx) => `m/44'/60'/0'/0/${idx}` }],
  [PathTypes.LedgerLive, { path: (idx) => `m/44'/60'/${idx}/0/0` }],
  [PathTypes.LedgerLegacy, { path: (idx) => `m/44'/60'/0'/${idx}` }],
])

export const derivePath = (pathType: PathTypes, isPK: boolean, $index: number) => {
  if (isPK) {
    return null
  }
  const deriver = paths.get(pathType || PathTypes.BIP44)
  if (!deriver) {
    return null
  }
  return deriver.path($index)
}
