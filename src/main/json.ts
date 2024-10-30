
export const valueToJSON = {
  stringify: (value: object) => {
    return JSON.stringify(value, (_k, v) => {
      if (typeof v === 'bigint') {
        return {
          type: 'bigint',
          value: v.toString(),
        }
      }
      return v
    }, 2)
  },
  parse: <T = any>(value: string): T => {
    return JSON.parse(value, (_k, v) => {
      if (v && typeof v === 'object' && v.type === 'bigint' && typeof v.value === 'string') {
        return BigInt(v.value)
      }
      return v
    })
  },
}
