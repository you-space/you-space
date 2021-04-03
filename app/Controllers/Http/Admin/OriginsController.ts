import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Origin, { OriginConfig, OriginTypes } from 'App/Models/Origin'
import OriginProvider from 'App/Services/Origin/OriginProvider'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'
import OriginValidator from 'App/Validators/OriginValidator'

export default class OriginsController {
  public async index() {
    return Origin.query().preload('metadata')
  }

  public async store({ request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginValidator)

    if (type === OriginTypes.Main) {
      throw new Error("can't create main origin")
    }

    await OriginProvider.checkConfig(config as OriginConfig)

    return Origin.create({
      name,
      type,
      config: config as OriginConfig,
    })
  }

  public async show({ params }: HttpContextContract) {
    return Origin.query().where('id', params.id).preload('metadata').firstOrFail()
  }

  public async update({ params, request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginUpdateValidator)
    const origin = await Origin.findOrFail(params.id)

    if (type === OriginTypes.Main) {
      throw new Error("can't set main origin")
    }

    if (type) {
      origin.type = type
    }

    if (name) {
      origin.name = name
    }

    if (config) {
      await OriginProvider.checkConfig(config as OriginConfig)
      origin.config = config as OriginConfig
    }

    await origin.save()

    return origin
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)
    if (origin.type === OriginTypes.Main) {
      throw new Error("can't delete main origin")
    }
    await origin.delete()
  }
}
