import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {}

  public async ready() {
    await import('../start/system-events')

    await this.registerQueues()

    const Socket = (await import('App/Services/Socket')).default

    Socket.boot()
  }

  public async registerQueues() {
    const Queue = (await import('App/Queue')).default

    const queue = new Queue()

    this.app.container.singleton('Queue', () => queue)
  }
}
