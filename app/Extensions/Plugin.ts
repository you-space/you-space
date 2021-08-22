import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import { extHook, extProperty } from './Decorators'
import BaseExtension from './BaseExtension'
import Application from '@ioc:Adonis/Core/Application'

import SystemMeta from 'App/Models/SystemMeta'

export default class Plugin extends BaseExtension {
  public static data = async () => {
    const activePlugins = await SystemMeta.firstOrCreateMetaArray('plugins:activated')

    return fs.readdirSync(Application.makePath('content', 'plugins')).map((plugin) => ({
      name: plugin.split('/').pop() as string,
      path: Application.makePath('content', 'plugins', plugin),
      active: activePlugins.includes(plugin.split('/').pop()),
    }))
  }

  @extProperty()
  public active: boolean

  @extProperty('ext-method')
  public start: () => Promise<void>

  @extProperty('ext-method')
  public stop: () => Promise<void>

  @extHook('before:start')
  public async beforeStart(plugin: Plugin) {
    if (plugin.active) {
      throw new Error('plugin already active')
    }
  }

  @extHook('before:stop')
  public async beforeStop(plugin: Plugin) {
    if (!plugin.active) {
      throw new Error('plugin not active')
    }
  }

  @extHook('after:start')
  public async afterStart(plugin: Plugin) {
    const activePlugins = await SystemMeta.firstOrCreateMetaArray('plugins:activated')

    await SystemMeta.updateOrCreateMetaArray('plugins:activated', [...activePlugins, plugin.name])

    Logger.info('plugin %s started', plugin.name)
  }

  @extHook('after:stop')
  public async afterStop(plugin: Plugin) {
    const activePlugins = await SystemMeta.firstOrCreateMetaArray('plugins:activated')

    await SystemMeta.updateOrCreateMetaArray(
      'plugins:activated',
      activePlugins.filter((p) => p !== plugin.name)
    )

    Logger.info('plugin %s stopped', plugin.name)
  }
}
