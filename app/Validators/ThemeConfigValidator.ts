import { schema } from '@ioc:Adonis/Core/Validator'

export default class ThemeConfigValidator {
  public schema = schema.create({
    name: schema.string(),
    author: schema.object.optional().members({
      name: schema.string(),
      email: schema.string.optional(),
    }),
    screenshots: schema.object.optional().members({
      desktop: schema.string(),
      mobile: schema.string.optional(),
    }),
    dashboard: schema.object.optional().members({
      pages: schema.array.optional().members(
        schema.object().members({
          title: schema.string(),
          path: schema.string(),
        })
      ),
    }),
  })
}
