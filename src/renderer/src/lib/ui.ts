import { writable } from 'svelte/store'

export const stickyFilled = writable(false)

export const stickyFilledOnMount = () => {
  stickyFilled.set(true)
  return () => {
    stickyFilled.set(false)
  }
}
