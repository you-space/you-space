import { schema } from '@ioc:Adonis/Core/Validator'

export default class ImageStoreValidator {
  public schema = schema.create({
    src: schema.string(),
    alt: schema.string.optional(),
    source: schema.string.optional(),
  })
  public messages = {}
}
