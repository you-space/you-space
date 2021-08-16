import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TypeFieldStoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string({}, [rules.regex(/^[a-zA-Z0-9_.-]*$/)]),
    type: schema.enum(['mapped', 'editable']),
    options: schema.object.optional().anyMembers(),
  })

  public messages = {
    'name.regex': "name can't contain special chars or spaces",
  }
}
