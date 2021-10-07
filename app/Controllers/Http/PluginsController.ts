import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Space from 'App/Services/Space'

export default class PluginsController {
  public async index() {
    const plugins = await Space.emit<any[]>('plugin:index')

    if (!plugins) return []

    return plugins.map((p) => ({
      name: p.name,
      active: p.active,
    }))
  }

  public async store({ request }: HttpContextContract) {
    // const { gitUrl } = await request.validate({
    //   schema: schema.create({
    //     gitUrl: schema.string({}, [
    //       rules.url({
    //         allowedHosts: ['github.com'],
    //       }),
    //     ]),
    //   }),
    // })
    // await Plugin.create(gitUrl)
    // return {
    //   message: 'Plugin downloaded',
    // }
  }

  public async update({ request, params }: HttpContextContract) {
    const name = params.id

    const { active } = await request.validate({
      schema: schema.create({
        active: schema.boolean(),
      }),
    })

    if (active) {
      await Space.emit('plugin:start', name)
    }

    if (!active) {
      await Space.emit('plugin:stop', name)
    }

    return {
      status: 200,
      message: 'Plugin ' + (active ? 'activated' : 'deactivated'),
    }
  }

  public async destroy({ params }: HttpContextContract) {
    // const plugin = await Plugin.findOrFail(params.id)
    // const isActive = await plugin.isActive()
    // if (isActive) {
    //   throw new Error('can not delete active plugin')
    // }
    // await plugin.delete()
    // return {
    //   message: 'Theme deleted',
    // }
  }
}
