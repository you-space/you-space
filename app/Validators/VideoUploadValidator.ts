import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class VideoUploadValidator {
  public schema = schema.create({
    file: schema.file({
      extnames: ['mp4', 'webm'],
    }),
    visibilityId: schema.number.optional([rules.exists({ table: 'visibilities', column: 'id' })]),
    slug: schema.string(),
    title: schema.string(),
    description: schema.string(),
    publishedAt: schema.date({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
  })
  public messages = {}
}
