import { schema, rules } from '@ioc:Adonis/Core/Validator'
import View from 'App/Models/View'

const columns = Array.from(View.$columnsDefinitions.keys())

export default class ViewIndexValidator {
  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    fields: schema.enumSet.optional(columns),
    orderBy: schema.enum.optional(columns),
    orderDesc: schema.boolean.optional(),
  })

  public messages = {}
}
