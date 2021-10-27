import fs from 'fs'
import path from 'path'
import execa from 'execa'

import Logger from '@ioc:Adonis/Core/Logger'
import Drive from '@ioc:Adonis/Core/Drive'

import Content from 'App/Services/ContentService'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import { uniq } from 'lodash'
import { isGitUrl } from 'App/Helpers'

export default class Plugin {
  public async index() {
    const context = await fs.promises.readdir(Content.makePath('plugins'), {
      withFileTypes: true,
    })

    const pluginsActive = await this.findActive()

    return context
      .filter((f) => f.isDirectory())
      .map((f) => Content.makePath('plugins', f.name))
      .map((filename) => ({
        filename,
        name: path.basename(filename),
        active: pluginsActive.includes(path.basename(filename)),
      }))
  }

  public async show(name: string) {
    const filename = Content.makePath('plugins', name)

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

  public async store(gitUrl: string) {
    const name = path.basename(gitUrl).replace('.git', '')
    const filename = Content.makePath('plugins', name)
    const isValid = await isGitUrl(gitUrl)

    if (!isValid) {
      throw new Error('Repository url invalid')
    }

    const exist = await Drive.exists(filename)

    if (exist) {
      throw new Error('plugin already installed')
    }

    await execa('git', ['clone', gitUrl, filename])
  }

  public async delete(name: string) {
    const plugin = await this.show(name)

    if (!plugin) {
      throw new Error('plugin not found')
    }

    if (plugin.active) {
      throw new Error('plugin is active')
    }

    await execa('rm', ['-rf', plugin.filename])
  }

  public async findActive() {
    return await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)
  }

  public async start(name: string) {
    const plugin = await this.show(name)

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
    const plugin = await this.show(name)

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
