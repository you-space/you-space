import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Comment from 'App/Models/Comment'

const columns = Array.from(Comment.$columnsDefinitions.keys())

export default class CommentIndexValidator {
  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    orderBy: schema.enum.optional(columns),
    orderDesc: schema.boolean.optional(),
  })

  public messages = {}
}
