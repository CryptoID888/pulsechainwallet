import { app } from 'electron'
import path from 'path'

const userDataDir = app.getPath('userData')

export const paths = {
  resources: path.resolve(userDataDir, 'resources'),
  data: path.join(userDataDir, 'data'),
  db: path.join(userDataDir, 'db', 'userdata.db'),
}
