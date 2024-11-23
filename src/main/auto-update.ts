import { app, autoUpdater } from 'electron'

const server = 'https://update.electronjs.org'
const feed = `${server}/3commascapital/pulsechainwallet/${process.platform}-${process.arch}/${app.getVersion()}`

autoUpdater.setFeedURL({ url: feed })

let id: NodeJS.Timeout

export const start = () => {
  id = setInterval(
    () => {
      autoUpdater.checkForUpdates()
    },
    10 * 60 * 1000,
  )
}

export const stop = () => {
  clearInterval(id)
}
