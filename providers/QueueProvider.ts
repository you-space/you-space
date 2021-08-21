import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Queue from 'App/Queue'

export default class QueueProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const queue = new Queue()

    this.app.container.singleton('Queue', () => queue)
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
