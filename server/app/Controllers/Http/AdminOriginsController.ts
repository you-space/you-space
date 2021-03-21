import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Origin, { OriginConfig, OriginTypes } from 'App/Models/Origin'
import OriginProvider from 'App/Services/Origin/OriginProvider'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginYouTubeValidator from 'App/Validators/OriginYouTubeValidator'

export default class OriginsController {
  public async index() {
    return Origin.query().preload('metadata')
  }

  public async store({ request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginValidator)

    if (type === OriginTypes.Main) {
      throw new Error("can't create main origin")
    }

    if (type === 'you-tube') {
      await request.validate(OriginYouTubeValidator)
    }

    await OriginProvider.checkConfig(config as OriginConfig)

    return Origin.create({
      name,
      type,
      config: config as OriginConfig,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)
    if (origin.type === OriginTypes.Main) {
      throw new Error("can't delete main origin")
    }
    await origin.delete()
  }
}
