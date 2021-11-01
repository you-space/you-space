import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CommentUpdateValidator {
  public schema = schema.create({
    id: schema.number(),

    content: schema.string.optional(),
    username: schema.string.optional(),
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
