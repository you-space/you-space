import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CommentStoreValidator {
  public schema = schema.create({
    video_id: schema.number([rules.exists({ table: 'videos', column: 'id' })]),
    content: schema.string(),
    username: schema.string(),
    avatar_src: schema.string.optional(),

    source: schema.string.optional(),
    source_id: schema.string.optional(),
    parent_id: schema.number.optional([rules.exists({ table: 'comments', column: 'id' })]),
    published_at: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
  })

  public messages = {}
}
