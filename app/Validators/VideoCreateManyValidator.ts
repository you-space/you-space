import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class VideoCreateManyValidator {
  public schema = schema.create({
    videos: schema.array([rules.minLength(1)]).members(
      schema.object().members({
        videoId: schema.string(),
        title: schema.string(),
        source: schema.string(),
        src: schema.string(),
        description: schema.string.optional(),
      })
    ),
  })
}
