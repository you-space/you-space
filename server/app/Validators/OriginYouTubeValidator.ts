import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OriginYouTubeValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    config: schema.object().members({
      apiToken: schema.string(),
      channelId: schema.string(),
    }),
  })
  public messages = {}
}
