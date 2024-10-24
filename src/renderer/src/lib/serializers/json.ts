export const isNumberType = (typeVal: string) => typeVal === 'number' || typeVal === 'bigint'
export const bigintToString = (k: unknown, v: unknown) => {
  if (isNumberType(typeof v)) {
    return (v as bigint | number).toString()
  }
  return v
}
export const bigintToHex = (k: unknown, v: unknown) => {
  if (isNumberType(typeof v)) {
    return `0x${(v as bigint | number).toString(16)}`
  }
  return v
}
