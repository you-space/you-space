import fs from 'fs'
import BaseExtension from './Utils/BaseExtension'
import { method, property, hook, manager } from './Utils/Decorators'
import Logger from '@ioc:Adonis/Core/Logger'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import Application from '@ioc:Adonis/Core/Application'
import TypeManager from './Utils/TypeManager'
import ProviderManager from './Utils/ProviderManager'

export default class Plugin extends BaseExtension {
  @property()
  public name: string

  @method()
  public start: () => Promise<void>

  @method()
  public stop: () => Promise<void>

  @manager.type()
  public type: TypeManager

  @manager.provider()
  public provider: ProviderManager

  public async isActive() {
    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    return meta.includes(this.name)
  }

  @hook('before:start')
  public async beforeStart(ext: Plugin) {
    const active = await ext.isActive()

    if (active) {
      throw new Error('plugin already active')
    }
  }

  @hook('after:start')
  public async afterStart(ext: Plugin) {
    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    await SystemMeta.updateOrCreateMetaArray(SystemDefaults.PluginsActive, [...meta, ext.name])

    Logger.info('plugin %s started', ext.name)
  }

  @hook('before:stop')
  public async beforeStop(ext: Plugin) {
    const active = await ext.isActive()

    if (!active) {
      throw new Error('plugin not active')
    }
  }

  @hook('after:stop')
  public async afterStop(ext: Plugin) {
    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    await SystemMeta.updateOrCreateMetaArray(
      SystemDefaults.PluginsActive,
      meta.filter((m) => m !== ext.name)
    )

    Logger.info('plugin %s stopped', ext.name)
  }

  public static async all() {
    const folders = await fs.promises.readdir(Application.makePath('content', 'plugins'))

    return await Promise.all(
      folders.map((name) => this.$mount(Application.makePath('content', 'plugins', name)))
    )
  }

  public static findOrFail(name: string) {
    return this.$mount(Application.makePath('content', 'plugins', name))
  }
}
