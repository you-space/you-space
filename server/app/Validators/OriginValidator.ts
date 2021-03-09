import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OriginValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string(),
    type: schema.enum(['you-tube']),
    config: schema.object().anyMembers(),
  })
  public messages = {}
}
