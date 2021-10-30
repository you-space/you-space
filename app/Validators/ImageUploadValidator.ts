import { schema } from '@ioc:Adonis/Core/Validator'

export default class ImageUploadValidator {
  public schema = schema.create({
    file: schema.file({
      extnames: ['jpg', 'jpeg', 'png', 'gif'],
    }),
    alt: schema.string.optional(),
  })
  public messages = {}
}
