import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { dirname, basename, join } from 'path'

export default class MakeUnitTest extends BaseCommand {
  public static commandName = 'make:test'
  public static description = ''

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  @args.string({ description: 'Source file to create teste', required: true })
  public filename: string

  public async run() {
    this.generator
      .addFile(basename(this.filename), { extname: '.unit.test.ts' })
      .appRoot(this.application.appRoot)
      .destinationDir(dirname(this.filename))
      .useMustache()
      .stub(join(__dirname, './templates/test.txt'))
      .apply({
        name: `${basename(this.filename)} (unit)`,
      })

    await this.generator.run()
  }
}
