import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Comment from 'App/Models/Comment'

const columns = Array.from(Comment.$columnsDefinitions.keys()).map(string.snakeCase)

export default class CommentIndexValidator {
  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    order_by: schema.enum.optional(columns),
    order_desc: schema.boolean.optional(),
  })

  public messages = {}
}
