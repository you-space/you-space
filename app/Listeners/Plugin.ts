import fs from 'fs'
import path from 'path'

import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import Drive from '@ioc:Adonis/Core/Drive'

import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import { uniq } from 'lodash'

export default class Plugin {
  public async index() {
    const context = await fs.promises.readdir(Application.makePath('content', 'plugins'), {
      withFileTypes: true,
    })

    const pluginsActive = await this.findActive()

    return context
      .filter((f) => f.isDirectory())
      .map((f) => Application.makePath('content', 'plugins', f.name))
      .map((filename) => ({
        filename,
        name: path.basename(filename),
        active: pluginsActive.includes(path.basename(filename)),
      }))
  }

  public async findActive() {
    return await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)
  }

  public async find(name: string) {
    const filename = Application.makePath('content', 'plugins', name)

    const exist = await Drive.exists(filename)

    if (!exist) {
      return null
    }

    const pluginsActive = await this.findActive()

    return {
      filename,
      name: path.basename(filename),
      active: pluginsActive.includes(path.basename(filename)),
    }
  }

  public async start(name: string) {
    const plugin = await this.find(name)

    if (!plugin) {
      throw new Error('plugin not found')
    }

    const { start } = await import(plugin.filename)

    if (start) {
      await start()
    }

    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    const value = uniq([...meta, name])

    await SystemMeta.updateOrCreateMetaArray(SystemDefaults.PluginsActive, value)

    Logger.info('[plugins] %s started', name)
  }

  public async stop(name: string) {
    const plugin = await this.find(name)

    if (!plugin) {
      throw new Error('plugin not found')
    }

    const { stop } = await import(plugin.filename)

    if (stop) {
      await stop()
    }

    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    await SystemMeta.updateOrCreateMetaArray(
      SystemDefaults.PluginsActive,
      meta.filter((m) => m !== name)
    )

    Logger.info('[plugins]  %s stopped', name)
  }
}
