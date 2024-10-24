import type { Key } from '$preload/api'
import { writable as w, readable as r, derived as d, type Stores, type StoresValues, get } from 'svelte/store'

/**
 * Create a store that will emit data to the main process from the render process and be slave to the main process
 * @param eventKey the event key to listen to that will update the store from the main process
 * @param updater the function that will update the main process with data from the render process
 * @param defaultValue the default value of the store
 * @returns a writable store
 */
export const writable = <T>(
  eventKey: string,
  retrieve: () => Promise<T>,
  setOnMain: (key: Key, value: any) => Promise<void>,
  defaultValue: T,
) => {
  const store = w(defaultValue, (set) => {
    retrieve().then((data) => {
      set(data)
    })
    return window.electron.ipcRenderer.on(eventKey, (_, data) => {
      set(data)
    })
  })
  return {
    subscribe: store.subscribe,
    set: ($store: T) => {
      setOnMain('.', $store)
    },
    update: (fn: ($store: T) => T) => {
      setOnMain('.', fn(get(store)))
    },
    updatePartial: (k: Key, partial: any) => {
      setOnMain(k, partial)
    },
  }
}

/**
 * Create a store that will listen for data emitted from the main process and be slave to the main process
 * @param eventName the event key to listen to that will update the store from the main process
 * @param stores the stores to listen to that will re-trigger updates from the main process
 * @param updateRequester the function that will request data from the main process
 * @param defaultValue the default value of the store
 * @returns a derived store
 */
export const derived = <S extends Stores, T>(
  eventName: string | null, stores: S,
  updateRequester: (stores: StoresValues<Stores>) => Promise<T>,
  defaultValue: T,
) => {
  const store = d(stores, (stores, set) => {
    let cancelled = false
    const update = (result: T) => {
      if (cancelled) return
      set(result)
    }
    updateRequester(stores).then(update)
    const cancel = eventName ? window.electron.ipcRenderer.on(eventName, (_, data) => {
      update(data)
    }) : () => { }
    return () => {
      cancelled = true
      cancel()
    }
  }, defaultValue)
  return store
}

/**
 * Create a store that will listen for data emitted from the main process and be slave to the main process
 * @param eventKey the event key to listen to that will update the store from the main process
 * @param updateRequester the function that will request data from the main process
 * @param defaultValue the default value of the store
 * @returns a readable store
 */
export const readable = <T>(eventKey: string, updateRequester: () => Promise<T>, defaultValue: T) => {
  const store = r(defaultValue, (set) => {
    let cancelled = false
    const update = (result: T) => {
      if (cancelled) return
      set(result)
    }
    updateRequester().then(update)
    const cleanup = window.electron.ipcRenderer.on(eventKey, (_, data) => {
      update(data)
    })
    return () => {
      cancelled = true
      cleanup()
    }
  })
  return store
}
