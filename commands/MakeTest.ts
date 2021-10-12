import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class MakeUnitTest extends BaseCommand {
  public static commandName = 'make:test'
  public static description = 'Create a test file'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  @args.string({ description: 'Source file to create test', required: true })
  public name: string

  public async run() {
    this.generator
      .addFile(this.name, { extname: '.test.ts', pattern: 'pascalcase' })
      .appRoot(this.application.appRoot)
      .destinationDir('tests')
      .useMustache()
      .stub(join(__dirname, './templates/test.txt'))
      .apply({
        name: this.name,
      })

    await this.generator.run()
  }
}
