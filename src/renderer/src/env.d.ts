/// <reference types="svelte" />
/// <reference types="vite/client" />
import type { ElectronAPI } from '@electron-toolkit/preload'
import type { API } from '$preload/api'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

declare const api: API
