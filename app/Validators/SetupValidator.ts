import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    database: schema.object().members({
      database: schema.string(),
      host: schema.string(),
      port: schema.number(),
      user: schema.string(),
      password: schema.string(),
    }),
    user: schema.object().members({
      username: schema.string(),
      password: schema.string({}, [rules.confirmed()]),
    }),
  })
  public messages = {}
}
