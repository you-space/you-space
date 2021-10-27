import { schema } from '@ioc:Adonis/Core/Validator'
import { TypeSchema } from 'App/Models/Type'

export default class ItemValueValidator {
  public schema = schema.create({})

  constructor(typeSchema: TypeSchema) {
    const fields = {}

    Object.entries(typeSchema).forEach(([key, field]) => {
      if (field.required) {
        fields[key] = schema[field.type]()
        return
      }

      if (field.type === 'string') {
        fields[key] = schema.string.optional()
      }

      if (field.type === 'number') {
        fields[key] = schema.number.optional()
      }
    })

    this.schema = schema.create(fields)
  }

  public messages = {}
}
