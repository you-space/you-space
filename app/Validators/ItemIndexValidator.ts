import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ItemIndexValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional(),

    // only available if typeid is defined options
    serialize: schema.boolean.optional(),
    showOriginals: schema.boolean.optional(),

    typeId: schema.number.optional([
      rules.requiredIfExistsAny(['serialize']),
      rules.exists({
        table: 'item_types',
        column: 'id',
      }),
    ]),
  })

  public messages = {}
}
