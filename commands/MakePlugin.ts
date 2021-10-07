import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class MakePlugin extends BaseCommand {
  public static commandName = 'make:plugin'
  public static description = 'Create a plugin'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  @args.string({ description: 'Name of plugin', required: true })
  public name: string

  public async run() {
    this.generator
      .addFile('index', { extname: '.js' })
      .appRoot(this.application.appRoot)
      .destinationDir(`content/plugins/${this.name}`)
      // .useMustache()
      .stub(join(__dirname, './templates/plugin.txt'))

    await this.generator.run()
  }
}
