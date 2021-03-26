import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OriginTypes } from 'App/Models/Origin'

export default class OriginValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string(),
    type: schema.enum(Object.values(OriginTypes)),
    config: schema.object().anyMembers(),
  })
  public messages = {}
}
