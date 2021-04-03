import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OriginTypes } from 'App/Models/Origin'

const anyConfig = schema.object.optional().anyMembers()

const youtubeConfig = schema.object.optional().members({
  apiKey: schema.string(),
  channelId: schema.string(),
})

export default class OriginUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public selectedType = this.ctx.request.input('type')

  public schema = schema.create({
    name: schema.string.optional(),
    type: schema.enum.optional(Object.values(OriginTypes)),
    config: this.selectedType === OriginTypes.YouTube ? youtubeConfig : anyConfig,
  })
  public messages = {}
}
