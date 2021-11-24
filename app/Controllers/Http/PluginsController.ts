import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Space from 'App/Services/SpaceService'

export default class PluginsController {
  public async index() {
    const plugins = (await Space.emit<any[]>('plugin:index')) || []

    const data = plugins.map((p) => ({
      id: p.id,
      title: p.title,
      active: p.active,
    }))

    return { data }
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

    await Space.emit('plugin:store', gitUrl)

    return {
      message: 'Plugin downloaded',
    }
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
    const name = params.id

    await Space.emit('plugin:delete', name)

    return {
      message: 'Plugin deleted',
    }
  }
}
