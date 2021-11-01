import { schema } from '@ioc:Adonis/Core/Validator'

export default class ViewShowValidator {
  public schema = schema.create({
    id: schema.number(),
  })
  public messages = {}
}
