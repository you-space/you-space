import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import moduleAlias from 'module-alias'
import path from 'path'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    this.registerServicesAlias()

    await this.registerQueue()

    await this.startActivePlugins()

    await this.registerAssets()
  }

  public async ready() {}

  public async shutdown() {
    // Cleanup, since app is going down
  }

  public async registerQueue() {
    const Queue = (await import('App/Queue')).default

    const queue = new Queue()

    this.app.container.singleton('Queue', () => queue)
  }

  public async registerServicesAlias() {
    moduleAlias.addAlias(`@you-space:services`, path.resolve(__dirname, '..', 'app', 'Services'))

    this.app.logger.debug('[register] %s alias registered', `@you-space:services`)
  }

  public async startActivePlugins() {
    const Plugin = (await import('App/Extensions/Plugin')).default

    await Plugin.startActivePlugins()
  }

  public async registerAssets() {
    const { assets } = require('@you-space:services')

    await assets.create('@you-space:services', this.app.resourcesPath('services.js'))
  }
}
