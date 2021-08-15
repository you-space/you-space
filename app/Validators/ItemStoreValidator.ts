import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ItemStoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    value: schema.object().anyMembers(),
    typeId: schema.number([
      rules.exists({
        table: 'types',
        column: 'id',
      }),
    ]),
  })
  public messages = {}
}
