import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ItemIndexValidator {
  constructor() {}

  public schema = schema.create({
    id: schema.string.optional(),
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    raw: schema.boolean.optional(),
    type: schema.string.optional(),
    include: schema.string.optional(),
  })
}
