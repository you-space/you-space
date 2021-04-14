import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginMainProvider {
  public static needsApplication = true
  constructor(protected application: ApplicationContract) {}

  public async register() {
    const Database = (await import('@ioc:Adonis/Lucid/Database')).default
    const haveTable = await Database.connection().schema.hasTable('origins')

    if (!haveTable) {
      return
    }

    const Origin = (await import('App/Models/Origin')).default
    const OriginTypes = (await import('App/Models/Origin')).OriginTypes

    const main = await Origin.firstOrCreate({
      name: OriginTypes.Main,
      type: OriginTypes.Main,
    })

    this.application.container.singleton('Providers/OriginMainProvider', () => main)
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
