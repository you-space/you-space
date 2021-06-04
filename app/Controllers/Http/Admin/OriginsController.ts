import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'
import { PluginService } from 'App/Services/PluginService'

export default class OriginsController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('page', 20)

    const pluginService = new PluginService()
    const providers = await pluginService.getRegisteredProviders()

    const pagination = await Origin.query().paginate(page, limit)

    const origins = await Promise.all(
      pagination.all().map((o) => {
        let provider = providers.find((p) => p.name === o.providerName)
        return {
          ...provider,
          ...o.serialize(),
        }
      })
    )

    return {
      data: origins,
      meta: pagination.getMeta(),
    }
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(OriginValidator)

    return await Origin.create(data)
  }

  public async show({ params }: HttpContextContract) {
    throw new Error('refactoring')
    // return await Origin.query().where('id', params.id).firstOrFail()
  }

  public async update({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const updateData = await request.validate(OriginUpdateValidator)

    Object.assign(origin, updateData)

    await origin.save()

    return {
      status: 200,
      message: 'Origin updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    throw new Error('refactoring')
    // const origin = await Origin.findOrFail(params.id)
    // await origin.delete()
  }
}
