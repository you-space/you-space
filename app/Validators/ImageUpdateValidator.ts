import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ImageUpdateValidator {
  public schema = schema.create({
    id: schema.number(),
    src: schema.string.optional({}, [rules.url()]),
    alt: schema.string.optional(),
  })
  public messages = {}
}
