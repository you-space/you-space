import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ViewStoreValidator {
  public schema = schema.create({
    video_id: schema.number([rules.exists({ table: 'videos', column: 'id' })]),
    source: schema.string.optional(),
    count: schema.number(),
  })

  public messages = {}
}
