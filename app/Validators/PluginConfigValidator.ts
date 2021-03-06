import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Content from 'App/Services/ContentService'

export default class PluginConfigValidator {
  constructor(public id: string) {}
  public schema = schema.create({
    name: schema.string(),
    description: schema.string.optional(),
    providers: schema.array.optional().members(
      schema.object().members({
        id: schema.string({}),
        name: schema.string(),
        description: schema.string.optional(),
        files: schema.object.optional().members({
          import: schema.string.optional({}, [
            rules.fileExist(Content.makePath('plugins', this.id)),
          ]),
        }),
        fields: schema.array.optional().members(
          schema.object().members({
            name: schema.string(),
            type: schema.enum(['string']),
            required: schema.boolean.optional(),
          })
        ),
      })
    ),
  })
  public messages = {}
}
