/// <reference types="svelte" />
/// <reference types="vite/client" />
import type { ElectronAPI } from '@electron-toolkit/preload'
import type { API } from '$preload/api'

declare global {
  // interface HTMLAttributes {
  //   'on:visible'?: (e: CustomEvent<boolean>) => void
  // }
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    'on:visible'?: (event: CustomEvent<boolean> & { target: EventTarget & T }) => unknown
  }
}

declare const api: API
