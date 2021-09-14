import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class QueueProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const Queue = (await import('App/Queue')).default

    const queue = new Queue()

    this.app.container.singleton('Queue', () => queue)
  }

  public async ready() {}

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
