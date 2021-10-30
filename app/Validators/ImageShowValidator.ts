import { schema } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Image from 'App/Models/Image'

export default class ImageShowValidator {
  public schema = schema.create({
    id: schema.number(),
    fields: schema.array
      .optional()
      .members(schema.enum(Array.from(Image.$columnsDefinitions.keys()).map(string.snakeCase))),
  })
  public messages = {
    'id.exists': 'Image not found',
  }
}
