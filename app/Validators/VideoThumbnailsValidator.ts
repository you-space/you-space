import { schema } from '@ioc:Adonis/Core/Validator'

export default class VideoThumbnailsValidator {
  public schema = schema.create({
    images: schema.array().members(
      schema.object().members({
        videoId: schema.string(),
        name: schema.string(),
        source: schema.string(),
        src: schema.string(),
        alt: schema.string.optional(),
      })
    ),
  })

  public messages = {}
}
