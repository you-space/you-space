import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginServiceProvider {
  public static needsApplication = true

  constructor(protected application: ApplicationContract) {}

  public async boot() {
    await this.registerOriginService()
    await this.registerAuthenticateByToken()
    await this.registerSocket()
    await this.registerPluginHelper()
  }

  public async registerOriginService() {
    this.application.container.singleton('Providers/OriginService', () => {
      const OriginService = require('App/Services/Origin/OriginService').default

      return new OriginService()
    })
  }

  public async registerAuthenticateByToken() {
    const AuthenticateByTokenService = (await import('App/Services/AuthenticateByTokenService'))
      .default

    const authenticateByTokenService = new AuthenticateByTokenService()

    this.application.container.singleton(
      'Providers/AuthenticateByTokenService',
      () => authenticateByTokenService
    )
  }

  public async registerSocket() {
    const SocketService = (await import('App/Services/SocketService')).default

    const socketService = new SocketService()

    this.application.container.singleton('Providers/SocketService', () => socketService)
  }

  public async registerPluginHelper() {
    const PluginHelper = (await import('App/Services/PluginHelper')).default

    const service = new PluginHelper()

    this.application.container.singleton('Providers/PluginHelper', () => service)
  }
}
