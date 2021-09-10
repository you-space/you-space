import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Plugin from 'App/Extensions/Plugin'

export default class PluginsController {
  public async index() {
    const plugins = await Plugin.all()

    const data = await Promise.all(
      plugins.map(async (p) => {
        return {
          name: p.name,
          active: await p.isActive(),
        }
      })
    )

    return data
  }

  public async store({ request }: HttpContextContract) {
    const { gitUrl } = await request.validate({
      schema: schema.create({
        gitUrl: schema.string({}, [
          rules.url({
            allowedHosts: ['github.com'],
          }),
        ]),
      }),
    })

    await Plugin.create(gitUrl)

    return {
      message: 'Plugin downloaded',
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const plugin = await Plugin.findOrFail(params.id)

    const { active } = await request.validate({
      schema: schema.create({
        active: schema.boolean(),
      }),
    })

    if (active) {
      await plugin.start()
    }

    if (!active) {
      await plugin.stop()
    }

    return {
      status: 200,
      message: 'Plugin ' + (active ? 'activated' : 'deactivated'),
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const plugin = await Plugin.findOrFail(params.id)

    const isActive = await plugin.isActive()

    if (isActive) {
      throw new Error('can not delete active plugin')
    }

    await plugin.delete()

    return {
      message: 'Theme deleted',
    }
  }
}
