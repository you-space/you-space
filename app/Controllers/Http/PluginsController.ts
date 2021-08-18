import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import { promisify } from 'util'
import fs from 'fs'
import SystemMeta from 'App/Models/SystemMeta'
import { PluginService } from 'App/Services/PluginService'

export default class PluginsController {
  public async index() {
    const folderPath = Application.makePath('content', 'plugins')
    const context = await promisify(fs.readdir)(folderPath, { withFileTypes: true })
    const pluginFolders = context.filter((d) => d.isDirectory()).map((d) => d.name)

    const meta = await SystemMeta.firstOrCreateMetaArray<string>('plugins:activated')

    return pluginFolders.map((name) => ({
      name,
      active: meta.includes(name),
    }))
  }

  public async update({ request, params }: HttpContextContract) {
    const name = params.id

    const { active } = await request.validate({
      schema: schema.create({
        active: schema.boolean(),
      }),
    })

    const folderPath = Application.makePath('content', 'plugins', name, 'index.js')
    const exists = await promisify(fs.exists)(folderPath)

    if (!exists) {
      throw new Error('plugin not found')
    }

    const PluginClass = (await import(folderPath)).default

    const plugin = new PluginClass()

    plugin.service = new PluginService(name)

    const meta = await SystemMeta.firstOrCreateMetaArray<string>('plugins:activated')

    // start plugin
    if (active && !meta.includes(name)) {
      meta.push(name)

      if (plugin.start) {
        await plugin.start()
      }
    }

    // stop plugin
    if (!active && meta.includes(name)) {
      meta.splice(meta.indexOf(name))

      if (plugin.stop) {
        await plugin.stop()
      }
    }

    await SystemMeta.updateOrCreateMetaArray('plugins:activated', meta)

    return {
      status: 200,
      message: 'Plugin updated',
    }
  }
}
