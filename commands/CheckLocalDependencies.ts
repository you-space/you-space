import { BaseCommand } from '@adonisjs/core/build/standalone'
import fs from 'fs'

export default class CheckLocalDependencies extends BaseCommand {
  public static commandName = 'check:local-dependencies'
  public static description = 'Check if package.json have some local package installed'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    this.logger.info('Checking package.json')

    const filename = this.application.makePath('package.json')

    const content = await fs.promises.readFile(filename, 'utf8')

    const have = content.includes('file:')

    if (have) {
      this.logger.error('Your package.json have some local package installed')
      return process.exit(1)
    }

    this.logger.success('All clear')
  }
}
