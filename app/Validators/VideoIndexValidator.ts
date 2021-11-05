import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Video from 'App/Models/Video'

const columns = Array.from(Video.$columnsDefinitions.keys())

export default class VideoIndexValidator {
  public schema = schema.create({
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),
    orderBy: schema.enum.optional(columns),
    orderDesc: schema.boolean.optional(),

    fields: schema.array.optional().members(schema.enum(columns)),
    include: schema.array.optional().members(schema.enum(['images', 'views', 'comments'])),

    id: schema.array.optional().members(schema.number()),
  })

  public messages = {}
}
