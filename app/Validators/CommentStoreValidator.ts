import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CommentStoreValidator {
  public schema = schema.create({
    videoId: schema.number([rules.exists({ table: 'videos', column: 'id' })]),
    content: schema.string(),
    username: schema.string(),
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
