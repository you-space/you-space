import { schema } from '@ioc:Adonis/Core/Validator'

export default class ImageUpdateValidator {
  public schema = schema.create({
    id: schema.number(),
    src: schema.string.optional(),
    alt: schema.string.optional(),
    source: schema.string.optional(),
    name: schema.string.optional(),
  })
  public messages = {}
}
