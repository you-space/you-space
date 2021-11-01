import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ViewUpdateValidator {
  public schema = schema.create({
    id: schema.number(),
    video_id: schema.number.optional([rules.exists({ table: 'videos', column: 'id' })]),
    source: schema.string.optional(),
    count: schema.number.optional(),
  })
  public messages = {}
}
