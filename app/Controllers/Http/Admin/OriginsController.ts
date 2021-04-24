import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'

export default class OriginsController {
  public async index() {
    const origins = await Origin.query()

    return origins.map((o) => ({
      ...o.serialize(),
      videosCount: Number(o.$extras.videos_count),
    }))
  }

  public async store({ request }: HttpContextContract) {
    const { name } = await request.validate(OriginValidator)

    return await Origin.create({
      name,
    })
  }

  public async show({ params }: HttpContextContract) {
    return await Origin.query().where('id', params.id).firstOrFail()
  }

  public async update({ params, request }: HttpContextContract) {
    const { name } = await request.validate(OriginValidator)

    const origin = await Origin.findOrFail(params.id)

    origin.name = name

    await origin.save()

    return origin
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)
    await origin.delete()
  }
}
