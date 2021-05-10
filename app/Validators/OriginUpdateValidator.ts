import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class OriginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [
      rules.unique({
        table: 'origins',
        column: 'name',
      }),
    ]),
    providerName: schema.string.optional(),
    active: schema.boolean.optional(),
    config: schema.object.optional().anyMembers(),
  })
  public messages = {}
}
