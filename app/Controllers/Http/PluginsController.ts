import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

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

    return {
      meta: {
        total: data.length,
      },
      data,
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
}
