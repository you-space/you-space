import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Origin from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginYouTubeValidator from 'App/Validators/OriginYouTubeValidator'

export default class OriginsController {
  public async index() {
    return Origin.all()
  }
  public async store({ request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginValidator)

    if (type === 'you-tube') {
      await request.validate(OriginYouTubeValidator)
    }

    return Origin.create({
      name,
      type,
      config,
    })
  }
}
