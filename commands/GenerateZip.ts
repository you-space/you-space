import archiver from 'archiver'
import path from 'path'
import fs from 'fs'

import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class GenerateZip extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'generate:zip'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    return this.generateZip(
      path.resolve(__dirname, '..', 'build'),
      path.resolve(__dirname, '..', 'release', 'build.zip')
    )
      .then(() => this.logger.info('operation completed'))
      .catch((err) => this.logger.error(err))
  }

  public async generateZip(source: string, destination: string) {
    const archive = archiver.create('zip', {})

    fs.mkdirSync(path.dirname(destination), { recursive: true })

    const output = fs.createWriteStream(destination)

    return new Promise((resolve, reject) => {
      archive.on('error', reject)
      output.on('close', resolve)

      archive.pipe(output)

      archive.directory(source, '').finalize()
    })
  }
}
