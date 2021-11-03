import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Image from 'App/Models/Image'

const columns = Array.from(Image.$columnsDefinitions.keys())
export default class ImageIndexValidator {
  constructor() {}

  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    fields: schema.array.optional().members(schema.enum(columns)),
    orderBy: schema.enum.optional(columns),
    orderDesc: schema.boolean.optional(),
  })

  public messages = {}
}
