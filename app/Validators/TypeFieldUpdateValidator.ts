import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TypeFieldTypes } from 'App/Models/TypeField'

export default class TypeFieldUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string.optional({}, [rules.regex(/^[a-zA-Z0-9_.-]*$/)]),
    type: schema.enum.optional(Object.values(TypeFieldTypes)),
    options: schema.object.optional().anyMembers(),
  })
  public messages = {
    'name.regex': "name can't contain special chars or spaces",
  }
}
