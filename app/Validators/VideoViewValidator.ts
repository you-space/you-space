import { schema } from '@ioc:Adonis/Core/Validator'

export default class VideoViewValidator {
  public schema = schema.create({
    views: schema.array().members(
      schema.object().members({
        videoId: schema.string(),
        source: schema.string(),
        count: schema.number(),
      })
    ),
  })
  public messages = {}
}
