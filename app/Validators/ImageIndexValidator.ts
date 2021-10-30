import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ImageIndexValidator {
  constructor() {}

  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    fields: schema.array
      .optional()
      .members(schema.enum(['id', 'src', 'alt', 'created_at', 'updated_at'])),
  })

  public messages = {}
}
