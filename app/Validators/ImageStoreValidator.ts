import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ImageStoreValidator {
  public schema = schema.create({
    src: schema.string({}, [rules.url()]),
    alt: schema.string.optional(),
  })
  public messages = {}
}
