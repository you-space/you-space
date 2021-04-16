import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginMainProvider {
  public static needsApplication = true
  constructor(protected application: ApplicationContract) {}

  public register() {
    // this.application.container.singleton('Providers/OriginMain', () => null)
  }

  public async boot() {
    const Origin = (await import('App/Models/Origin')).default
    const OriginTypes = (await import('App/Models/Origin')).OriginTypes
    const App = await import('@ioc:Adonis/Core/Application')

    if (App.default.environment === 'web') {
      const main = await Origin.firstOrCreate({
        name: OriginTypes.Main,
        type: OriginTypes.Main,
      })

      this.application.container.singleton('Providers/OriginMain', () => main)
    } else {
      this.application.container.singleton('Providers/OriginMain', () => null)
    }

    this.application.container.singleton('Providers/OriginService', () => {
      const OriginService = require('App/Services/Origin/OriginService').default

      return new OriginService()
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
