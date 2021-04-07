import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginServiceProvider {
  public static needsApplication = true

  constructor(protected application: ApplicationContract) {}

  public async register() {
    const OriginService = (await import('App/Services/Origin/OriginService')).default

    const service = new OriginService()

    this.application.container.singleton('Providers/OriginService', () => service)
  }
}
