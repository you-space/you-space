import { DriveConfig } from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'

const driveConfig: DriveConfig = {
  disk: 'local',

  disks: {
    local: {
      driver: 'local',
      visibility: 'public',
      root: Application.makePath('content', 'uploads'),
      basePath: '/uploads',
      //   serveAssets: true,
    },
  },
}

export default driveConfig
