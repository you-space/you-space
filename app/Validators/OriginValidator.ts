import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OriginTypes } from 'App/Models/Origin'

const anyConfig = schema.object().anyMembers()

const youtubeConfig = schema.object().members({
  apiKey: schema.string(),
  channelId: schema.string(),
})

export default class OriginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public selectedType = this.ctx.request.input('type')

  public schema = schema.create({
    name: schema.string({}, [
      rules.unique({
        table: 'origins',
        column: 'name',
      }),
    ]),
    type: schema.enum(Object.values(OriginTypes).filter((v) => v !== OriginTypes.Main)),
    config: this.selectedType === OriginTypes.YouTube ? youtubeConfig : anyConfig,
  })
  public messages = {}
}
