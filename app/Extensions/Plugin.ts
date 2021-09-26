import fs from 'fs'
import path from 'path'
import execa from 'execa'

import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'

import BaseExtension from './Utils/BaseExtension'
import { method, property, hook, manager } from './Utils/Decorators'
import TypeManager from './Utils/TypeManager'
import ProviderManager from './Utils/ProviderManager'
import { isGitUrl } from 'App/Services/Helpers'

export default class Plugin {
  // @property()
  // public name: string
  // @method()
  // public start: () => Promise<void>
  // @method()
  // public stop: () => Promise<void>
  // @manager.type(true)
  // public type: TypeManager
  // @manager.provider()
  // public provider: ProviderManager
  // public get filename() {
  //   return Application.makePath('content', 'plugins', this.name)
  // }
  // @hook('before:start')
  // public async beforeStart(ext: Plugin) {
  //   const active = await ext.isActive()
  //   if (active) {
  //     throw new Error('plugin already active')
  //   }
  // }
  // @hook('after:start')
  // public async afterStart(ext: Plugin) {
  //   const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)
  //   await SystemMeta.updateOrCreateMetaArray(SystemDefaults.PluginsActive, [...meta, ext.name])
  //   Logger.info('plugin %s started', ext.name)
  // }
  // @hook('before:stop')
  // public async beforeStop(ext: Plugin) {
  //   const active = await ext.isActive()
  //   if (!active) {
  //     throw new Error('plugin not active')
  //   }
  // }
  // @hook('after:stop')
  // public async afterStop(ext: Plugin) {
  //   const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)
  //   await SystemMeta.updateOrCreateMetaArray(
  //     SystemDefaults.PluginsActive,
  //     meta.filter((m) => m !== ext.name)
  //   )
  //   Logger.info('plugin %s stopped', ext.name)
  // }
  // public async isActive() {
  //   const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)
  //   return meta.includes(this.name)
  // }
  // public static async all() {
  //   const folders = await fs.promises.readdir(Application.makePath('content', 'plugins'), {
  //     withFileTypes: true,
  //   })
  //   return await Promise.all(
  //     folders.filter((f) => f.isDirectory()).map((f) => this.findOrFail(f.name))
  //   )
  // }
  // public static async findOrFail(name: string) {
  //   const plugin = await this.$mount(Application.makePath('content', 'plugins', name))
  //   if (!plugin) {
  //     throw new Error(`plugin ${name} not found or invalid`)
  //   }
  //   plugin.name = name
  //   return plugin
  // }
  // public static async create(url: string) {
  //   const name = path.basename(url).replace('.git', '')
  //   const filename = Application.makePath('content', 'plugins', name)
  //   const isValid = await isGitUrl(url)
  //   if (!isValid) {
  //     throw new Error('Repository url invalid')
  //   }
  //   const exist = await Drive.exists(filename)
  //   if (exist) {
  //     throw new Error('plugin already installed')
  //   }
  //   await execa('git', ['clone', url, filename])
  // }
  // public async delete() {
  //   await execa('rm', ['-rf', this.filename])
  // }

  public filename: string
  public name: string
  public exist: Boolean

  public async isActive() {
    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)
    return meta.includes(this.name)
  }

  public async start() {
    const { start } = await import(this.filename)

    if (start) {
      await start()
    }

    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    await SystemMeta.updateOrCreateMetaArray(SystemDefaults.PluginsActive, [...meta, this.name])

    Logger.info('[plugins] %s started', this.name)
  }

  public async stop() {
    const { stop } = await import(this.filename)

    if (stop) {
      await stop()
    }

    const meta = await SystemMeta.firstOrCreateMetaArray(SystemDefaults.PluginsActive)

    await SystemMeta.updateOrCreateMetaArray(
      SystemDefaults.PluginsActive,
      meta.filter((m) => m !== this.name)
    )

    Logger.info('[plugins]  %s stopped', this.name)
  }

  public static async mount(filename: string) {
    const plugin = new Plugin()

    plugin.filename = filename
    plugin.name = path.basename(filename)
    plugin.exist = await Drive.exists(filename)

    return plugin
  }

  public static async findAll() {
    const context = await fs.promises.readdir(Application.makePath('content', 'plugins'), {
      withFileTypes: true,
    })

    const filenames = context
      .filter((f) => f.isDirectory())
      .map((f) => Application.makePath('content', 'plugins', f.name))

    return await Promise.all(filenames.map(this.mount))
  }

  public static async findOrFail(name: string) {
    const plugin = await this.mount(Application.makePath('content', 'plugins', name))

    if (!plugin.exist) {
      throw new Error('plugin not found')
    }

    return plugin
  }
}
