import type { BrowserWindow } from 'electron'
import { writable as storedWritable } from '$main/store'
import { writable } from 'svelte/store'

export type WindowConfig = {
  show: boolean
  width: number
  height: number
  x: number
  y: number
}

const defaultWindowConfig: WindowConfig = {
  show: true,
  width: 800,
  height: 600,
  x: 0,
  y: 0,
}

export const main = writable<BrowserWindow | null>(null)
export const mainProps = storedWritable<Partial<WindowConfig>>('window', defaultWindowConfig)
