import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CommentUpdateValidator {
  public schema = schema.create({
    id: schema.number(),

    content: schema.string.optional(),
    username: schema.string.optional(),
    avatarSrc: schema.string.optional(),
    source: schema.string.optional(),
    sourceId: schema.string.optional(),
    parentId: schema.number.optional([rules.exists({ table: 'comments', column: 'id' })]),
    publishedAt: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
  })
  public messages = {}
}
