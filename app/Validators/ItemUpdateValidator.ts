import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ItemUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    value: schema.object.optional().anyMembers(),
    typeId: schema.number.optional([
      rules.exists({
        table: 'types',
        column: 'id',
      }),
    ]),
  })
  public messages = {}
}
