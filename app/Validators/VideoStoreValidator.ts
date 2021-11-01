import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class VideoStoreValidator {
  public schema = schema.create({
    visibilityId: schema.number.optional([rules.exists({ table: 'visibilities', column: 'id' })]),
    sourceId: schema.string.optional(),
    source: schema.string.optional(),
    slug: schema.string(),
    src: schema.string(),
    title: schema.string(),
    description: schema.string(),
    publishedAt: schema.date({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
    raw: schema.object.optional().anyMembers(),
  })

  public messages = {}
}
