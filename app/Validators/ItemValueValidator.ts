import { schema, rules } from '@ioc:Adonis/Core/Validator'
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

      fields[key] = schema[field.type].optional()
    })

    this.schema = schema.create(fields)
  }

  public messages = {}
}
