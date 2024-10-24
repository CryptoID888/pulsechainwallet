import { ElectronAPI } from '@electron-toolkit/preload'
import type { API } from './api'

declare module "*.json" {
  const value: any;
  export default value;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
declare const api: API
