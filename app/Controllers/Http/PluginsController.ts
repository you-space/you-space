import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import PluginRepository from 'App/Repositories/PluginRepository'
import PluginConfigValidator from 'App/Validators/PluginConfigValidator'

export default class PluginsController {
  constructor(public repository = PluginRepository) {}

  public async index() {
    const plugins = await this.repository.index()

    const data = plugins.map((plugin) => plugin.serialize(['id', 'name', 'description', 'active']))

    return {
      data,
    }
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

    await this.repository.store(gitUrl)

    return {
      message: 'Plugin downloaded',
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const { active } = await request.validate({
      schema: schema.create({
        active: schema.boolean(),
      }),
    })

    const plugin = await this.repository.show(params.id)

    if (!plugin) {
      return response.notFound({
        message: 'Plugin not found',
      })
    }

    const config = await plugin.findConfig()

    if (active) {
      await validator.validate({
        ...new PluginConfigValidator(plugin.id),
        data: config,
      })
    }

    await this.repository.update(params.id, active)

    return {
      message: 'Plugin updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    await this.repository.destroy(params.id)

    return {
      message: 'Plugin deleted',
    }
  }
}
