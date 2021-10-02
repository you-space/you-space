import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {}

  public async ready() {
    const Space = (await import('App/Services/Space')).default

    Space.boot()

    await import('../start/system-events')

    await this.registerQueues()

    await Space.emit('assets:create', {
      name: 'space',
      filename: this.app.resourcesPath('space.js'),
    })

    const plugins = await Space.emit('plugins:index')

    await Promise.all(
      plugins.filter((p) => p.active).map((p) => Space.emit('plugins:activate', p.name))
    )
  }

  public async registerQueues() {
    const Queue = (await import('App/Queue')).default

    const queue = new Queue()

    this.app.container.singleton('Queue', () => queue)
  }
}
