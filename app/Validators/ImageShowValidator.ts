import { schema } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Image from 'App/Models/Image'

const columns = Array.from(Image.$columnsDefinitions.keys()).map(string.snakeCase)

export default class ImageShowValidator {
  public schema = schema.create({
    id: schema.number(),
    fields: schema.array.optional().members(schema.enum(columns)),
  })
  public messages = {
    'id.exists': 'Image not found',
  }
}
