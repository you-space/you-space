import { schema } from '@ioc:Adonis/Core/Validator'

export default class ImageUpdateValidator {
  public schema = schema.create({
    id: schema.number(),
    src: schema.string(),
    alt: schema.string.optional(),
    source: schema.string.optional(),
  })
  public messages = {}
}
