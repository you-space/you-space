import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { join } from 'path'

export default class MakeEvent extends BaseCommand {
  public static commandName = 'make:event'
  public static description = 'create a new event system'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  @args.string({ description: 'Name of system event', required: true })
  public name: string

  public async run() {
    this.generator
      .addFile(this.name)
      .appRoot(this.application.appRoot)
      .destinationDir('start/events')
      // .useMustache()
      .stub(join(__dirname, './templates/event.txt'))
      .apply({})

    await this.generator.run()
  }
}
