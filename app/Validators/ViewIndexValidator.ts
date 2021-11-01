import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import View from 'App/Models/View'

const columns = Array.from(View.$columnsDefinitions.keys()).map(string.snakeCase)

export default class ViewIndexValidator {
  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    fields: schema.enumSet.optional(columns),
    order_by: schema.enum.optional(columns),
    order_desc: schema.boolean.optional(),
  })

  public messages = {}
}
