import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginMainProvider {
  constructor(protected application: ApplicationContract) {}

  public async register() {
    const Origin = (await import('App/Models/Origin')).default

    const main = await Origin.firstOrCreate({
      name: 'local',
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
