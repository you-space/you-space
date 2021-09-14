import { BaseCommand } from '@adonisjs/core/build/standalone'
import execa from 'execa'
import fs from 'fs'
import path from 'path'

export default class Start extends BaseCommand {
  public static commandName = 'start'
  public static description = 'Start the you-space instance'

  public static settings = {
    loadApp: false,
    stayAlive: true,
  }

  public start() {
    const serverFile = path.resolve(__dirname, '..', 'server.js')

    const isStandAlone = fs.existsSync(serverFile)

    const file = isStandAlone ? serverFile : 'ace'

    const args = isStandAlone ? [] : ['serve']

    const child = execa.node(file, args, {
      stdio: 'inherit',
    })

    child.on('exit', (code) => {
      if (code === 1) {
        this.start()
      }
    })
  }

  public async run() {
    this.start()
  }
}
