import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginServiceProvider {
  public static needsApplication = true

  constructor(protected application: ApplicationContract) {}

  public async boot() {
    await this.registerOriginService()
    await this.registerContent()
    await this.registerQueue()
    await this.registerAuthenticateByToken()
    await this.registerSocket()
  }

  public async registerOriginService() {
    this.application.container.singleton('Providers/OriginService', () => {
      const OriginService = require('App/Services/Origin/OriginService').default

      return new OriginService()
    })
  }

  public async registerContent() {
    const ContentService = (await import('App/Services/Content/ContentVideos')).default

    this.application.container.singleton('Providers/ContentService', () => new ContentService())
  }

  public async registerQueue() {
    const OriginQueue = (await import('App/Services/Queue/OriginQueue')).default

    const originQueue = new OriginQueue()

    this.application.container.singleton('Providers/Queue/OriginQueue', () => originQueue)
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
}
