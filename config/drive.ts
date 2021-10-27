import { DriveConfig } from '@ioc:Adonis/Core/Drive'
import Content from 'App/Services/ContentService'

const driveConfig: DriveConfig = {
  disk: 'local',

  disks: {
    local: {
      driver: 'local',
      visibility: 'public',
      root: Content.makePath('uploads'),
      basePath: '/uploads',
      //   serveAssets: true,
    },
  },
}

export default driveConfig
