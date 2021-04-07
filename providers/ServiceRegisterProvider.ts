import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class OriginServiceProvider {
  public static needsApplication = true

  constructor(protected application: ApplicationContract) {}

  public async register() {
    await this.registerOrigin()
    await this.registerQueue()
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
}
