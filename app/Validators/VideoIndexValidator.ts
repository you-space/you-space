import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

import Video from 'App/Models/Video'

const columns = Array.from(Video.$columnsDefinitions.keys()).map(string.snakeCase)

export default class VideoIndexValidator {
  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    fields: schema.array.optional().members(schema.enum(columns)),
    include: schema.array.optional().members(schema.enum(['images', 'views', 'comments'])),
    orderBy: schema.enum.optional(columns),
    orderDesc: schema.boolean.optional(),
  })

  public messages = {}
}
