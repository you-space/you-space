import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import moduleAlias from 'module-alias'
import path from 'path'

export default class OriginServiceProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    await this.registerAuthenticateByToken()
    await this.registerSocket()
    await this.registerServicesAlias()
  }

  public async registerAuthenticateByToken() {
    const AuthenticateByTokenService = (await import('App/Helpers/AuthenticateByTokenService'))
      .default

    const authenticateByTokenService = new AuthenticateByTokenService()

    this.app.container.singleton(
      'Providers/AuthenticateByTokenService',
      () => authenticateByTokenService
    )
  }

  public async registerSocket() {
    const SocketService = (await import('App/Helpers/SocketService')).default

    const socketService = new SocketService()

    this.app.container.singleton('Providers/SocketService', () => socketService)
  }

  public async registerServicesAlias() {
    moduleAlias.addAlias(`@you-space:services`, path.resolve(__dirname, '..', 'app', 'Services'))

    this.app.logger.debug('[register] %s alias registered', `@you-space:services`)
  }
}
