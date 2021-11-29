import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class VideoUpdateValidator {
  public schema = schema.create({
    visibilityId: schema.number.optional([rules.exists({ table: 'visibilities', column: 'id' })]),
    sourceId: schema.string.optional(),
    source: schema.string.optional(),
    slug: schema.string.optional(),
    src: schema.string.optional(),
    title: schema.string.optional(),
    description: schema.string.optional(),
    publishedAt: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
    raw: schema.object.optional().anyMembers(),
  })
  public messages = {}
}
