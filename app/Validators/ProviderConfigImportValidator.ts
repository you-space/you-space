import { schema } from '@ioc:Adonis/Core/Validator'
import Provider from 'App/Models/Provider'

export default class ProviderConfigImportValidator {
  public schema = schema.create({})
  public messages = {}

  constructor(protected fields: Provider['fields'] = []) {
    const schemas = fields.reduce((all, current) => {
      return {
        ...all,
        [current.name]: current.required ? schema.string() : schema.string.optional(),
      }
    }, {})

    this.schema = schema.create(schemas)
  }
}
