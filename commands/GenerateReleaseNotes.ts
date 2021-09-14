import conventionalChangelog from 'conventional-changelog'
import path from 'path'
import fs from 'fs'

import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class GenerateReleaseNotes extends BaseCommand {
  public static commandName = 'generate:release_notes'

  public static description = ''

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    return new Promise<void>((resolve, reject) => {
      const filename = path.resolve(__dirname, '..', 'release', 'release-notes.md')

      fs.mkdirSync(path.dirname(filename), { recursive: true })

      const stream = fs.createWriteStream(filename)

      conventionalChangelog({
        preset: 'angular',
      })
        .pipe(stream)
        .on('error', (err) => {
          reject()
          this.logger.error(err)
        })
        .on('close', () => {
          resolve()
          console.log(`Generated release note at ${filename}`)
        })
    })
  }
}
