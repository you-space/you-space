import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Origin, { OriginTypes } from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginYouTubeValidator from 'App/Validators/OriginYouTubeValidator'
import YoutubeProvider from '@ioc:Providers/YouTube'
import lodash from 'lodash'

export default class OriginsController {
  public async index() {
    return Origin.all()
  }

  public async store({ request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginValidator)

    if (type === OriginTypes.Main) {
      throw new Error("can't create main origin")
    }

    if (type === 'you-tube') {
      await request.validate(OriginYouTubeValidator)
    }

    const channel = await YoutubeProvider.finChannelDetails(config.apiToken, config.channelId)

    console.log(channel)

    return Origin.create({
      name,
      type,
      config: {
        ...config,
        uploadPlaylistId: lodash.get(channel, 'contentDetails.relatedPlaylists.uploads'),
      },
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
