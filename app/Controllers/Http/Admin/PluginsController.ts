import Application from '@ioc:Adonis/Core/Application'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

import execa from 'execa'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import { PluginService } from 'App/Services/PluginService'

export default class PluginsController {
  public service = new PluginService()

  public async index() {
    const folderPath = Application.makePath('content', 'plugins')
    const context = await promisify(fs.readdir)(folderPath, { withFileTypes: true })
    const pluginFolders = context.filter((d) => d.isDirectory()).map((d) => d.name)

    const option = await YsOption.findByOrFail('name', BaseOptions.ActivatedPlugins)

    return pluginFolders.map((name) => ({
      name,
      active: option.value.includes(name),
    }))
  }

  public async store({ request }: HttpContextContract) {
    const { githubUrl, branch } = await request.validate({
      schema: schema.create({
        githubUrl: schema.string({}, [rules.url()]),
        branch: schema.string.optional(),
      }),
    })

    const repoName = path.basename(githubUrl).replace('.git', '')

    const pluginPath = Application.makePath('content', 'plugins', repoName)

    const args = ['clone']

    if (branch) {
      args.push('--branch', branch)
    }

    args.push(githubUrl, pluginPath)

    await execa('git', args, {
      stdio: 'inherit',
    })
  }

  public async start({ request }: HttpContextContract) {
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const option = await YsOption.findByOrFail('name', BaseOptions.ActivatedPlugins)

    const activePlugins = option.value as string[]

    if (activePlugins.includes(name)) {
      throw new Error('plugin already active')
    }

    const folderPath = Application.makePath('content', 'plugins', name, 'index.js')
    const exists = await promisify(fs.exists)(folderPath)

    if (!exists) {
      throw new Error('plugin not found')
    }

    const PluginClass = (await import(folderPath)).default

    const plugin = new PluginClass()

    plugin.service = this.service.createPluginService(name)

    if (plugin.start) {
      await plugin.start()
    }

    activePlugins.push(name)

    option.value = activePlugins

    await option.save()

    return {
      status: 200,
      message: 'Plugin started',
    }
  }

  public async stop({ request }: HttpContextContract) {
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const folderPath = Application.makePath('content', 'plugins', name, 'index.js')
    const exists = await promisify(fs.exists)(folderPath)

    if (!exists) {
      throw new Error('plugin not found')
    }

    const PluginClass = (await import(folderPath)).default

    const plugin = new PluginClass()

    plugin.service = this.service.createPluginService(name)

    if (plugin.stop) {
      await plugin.stop()
    }

    const option = await YsOption.findByOrFail('name', BaseOptions.ActivatedPlugins)

    const plugins: string[] = option.value as string[]

    if (!plugins.includes(name)) {
      throw new Error('plugin not active')
    }

    plugins.splice(plugins.indexOf(name), 1)

    option.value = plugins

    await option.save()

    return {
      status: 200,
      message: 'Plugin stopped',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const { id: name } = params

    const folderPath = Application.makePath('content', 'plugins', name)
    const exists = await promisify(fs.exists)(folderPath)

    if (!exists) {
      throw new Error('plugin not found')
    }

    await promisify(fs.rmdir)(folderPath, { recursive: true })

    return {
      status: 200,
      message: 'Plugin deleted',
    }
  }
}
