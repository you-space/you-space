import { schema } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

import Video from 'App/Models/Video'

const columns = Array.from(Video.$columnsDefinitions.keys()).map(string.snakeCase)

export default class VideoShowValidator {
  public schema = schema.create({
    id: schema.number(),
    fields: schema.array.optional().members(schema.enum(columns)),
    orderBy: schema.enum.optional(columns),
    orderDesc: schema.boolean.optional(),
  })

  public messages = {}
}