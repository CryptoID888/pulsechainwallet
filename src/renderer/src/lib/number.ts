import { get } from 'svelte/store'
import { settings } from './settings'

export const addDelimiter = (x: bigint, delimiter: string = get(settings).digitGroupSeparator) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter)
}

export const joinNumber = (i: string, d: string) => {
  if (!i && !d) {
    return ''
  }
  if (!i) {
    i = '0'
  }
  if (!d) {
    return i
  }
  return `${i}.${d}`
}

export const sanitize = (i: string) => i.split(/\D+/gim).join('')

export const sanitizeDecimal = (id: string) => {
  const [i, d] = id.split('.')
  return joinNumber(sanitize(i), d ? sanitize(d) : '')
}

export const addDecimalDelimiter = (value: string, targetDecimals = -1) => {
  let [i, d = ''] = value.split('.')
  d = `${d}`
  const sanitizedI = sanitize(i)
  if (sanitizedI) {
    i = addDelimiter(BigInt(sanitizedI))
  }
  if (targetDecimals >= 0 && i !== '0') {
    if (d.length > targetDecimals) {
      d = d.slice(0, targetDecimals)
    }
  }
  return joinNumber(i, d)
}

export const log10 = (n: bigint) => n.toString().length - 1
export const leadingIsGreaterThan1 = (n: bigint) => +n.toString()[0] > 1
