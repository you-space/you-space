import { DriveConfig } from '@ioc:Adonis/Core/Drive'
import Content from 'App/Services/ContentService'

const driveConfig: DriveConfig = {
  disk: 'local',

  disks: {
    local: {
      driver: 'local',
      visibility: 'private',
      root: Content.makePath('uploads'),
    },
  },
}

export default driveConfig
