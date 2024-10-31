import { addDelimiter, sanitize, joinNumber } from '$lib/number'
import type { Action } from 'svelte/action'
import { formatUnits, parseUnits } from 'viem'

type Options = {
  decimals: number
  min: bigint
  max: bigint
  step: bigint
  delimiter: boolean
}

// the reason to have a separate function is to allow for dynamic options
export const delimiterRender = (paramReturn: () => Partial<Options>) => (el: HTMLInputElement, focused: boolean) => {
  const { decimals = 18, max, min, step = 1n, delimiter = true } = paramReturn() || {}
  let val = ''
  const currentValue = el.value
  let [i, d = ''] = currentValue.split('.')
  d = sanitize(d)
  d = d.slice(0, decimals)
  i = sanitize(i)
  val = joinNumber(i, d)
  let asInt = parseUnits(val, decimals)
  if (max !== undefined && asInt > max) {
    asInt = max
  }
  if (min !== undefined && asInt < min) {
    asInt = min
  }
  if (!focused) {
    asInt -= asInt % step
  }
  val = formatUnits(asInt, decimals)
  const valSplit = val.split('.')
  i = valSplit[0]
  d = valSplit[1]
  if (!focused) {
    i = delimiter ? addDelimiter(BigInt(i)) : i
    val = joinNumber(i, d)
  }
  if (currentValue && currentValue !== val) {
    el.value = val
  }
}

export type DelimiterRender = ReturnType<typeof delimiterRender>

export const delimiter: Action<HTMLInputElement, DelimiterRender> = (el, render) => {
  let focused = false
  // const { decimals = 18, max, min, step = 1n, delimiter = true } = params || {}
  // const render = () => {
  //   let val = ''
  //   const currentValue = el.value
  //   let [i, d = ''] = currentValue.split('.')
  //   d = sanitize(d)
  //   d = d.slice(0, decimals)
  //   i = sanitize(i)
  //   val = joinNumber(i, d)
  //   let asInt = parseUnits(val, decimals)
  //   if (max !== undefined && asInt > max) {
  //     asInt = max
  //   }
  //   if (min !== undefined && asInt < min) {
  //     asInt = min
  //   }
  //   if (!focused) {
  //     asInt -= asInt % step
  //   }
  //   val = formatUnits(asInt, decimals)
  //   const valSplit = val.split('.')
  //   i = valSplit[0]
  //   d = valSplit[1]
  //   if (!focused) {
  //     i = delimiter ? addDelimiter(BigInt(i)) : i
  //     val = joinNumber(i, d)
  //   }
  //   if (currentValue && currentValue !== val) {
  //     el.value = val
  //   }
  // }
  const focusHandler = () => {
    focused = true
    render(el, focused)
  }
  const blurHandler = () => {
    focused = false
    render(el, focused)
  }
  el.addEventListener('focus', focusHandler)
  el.addEventListener('blur', blurHandler)
  const cleanup = () => {
    el.removeEventListener('focus', focusHandler)
    el.removeEventListener('blur', blurHandler)
  }
  return {
    destroy: cleanup,
  }
}
