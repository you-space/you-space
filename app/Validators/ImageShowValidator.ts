import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ImageShowValidator {
  public schema = schema.create({
    id: schema.number(),
    fields: schema.array
      .optional()
      .members(schema.enum(['id', 'src', 'alt', 'created_at', 'updated_at'])),
  })
  public messages = {
    'id.exists': 'Image not found',
  }
}
