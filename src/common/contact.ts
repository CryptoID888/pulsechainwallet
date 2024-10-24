import type { Hex } from 'viem'
export type Contact = {
  address: Hex
  name: string
  note: string | null
}
