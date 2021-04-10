import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideoUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional(),
    description: schema.string.optional(),
    visibilityId: schema.number.optional([
      rules.exists({
        column: 'id',
        table: 'visibilities',
      }),
    ]),
    video: schema.file.optional({ extnames: ['mp4'], size: '1000mb' }),
    thumbnail: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
}
