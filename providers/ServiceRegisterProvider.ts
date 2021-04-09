import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginServiceProvider {
  public static needsApplication = true

  constructor(protected application: ApplicationContract) {}

  public async register() {
    await this.registerOrigin()
    await this.registerQueue()
    await this.registerAuthenticateByToken()
    await this.registerSocket()
  }

  public async registerOrigin() {
    const OriginService = (await import('App/Services/Origin/OriginService')).default

    const service = new OriginService()

    this.application.container.singleton('Providers/OriginService', () => service)
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
