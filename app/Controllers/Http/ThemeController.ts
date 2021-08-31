import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Theme from 'App/Extensions/Theme'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'

export default class ThemeController {
  public async index() {
    const themes = await Theme.all()

    return await Promise.all(
      themes.map(async (t) => ({
        name: t.name,
        active: await t.isActive(),
      }))
    )
  }

  public async setTheme({ request }: HttpContextContract) {
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    await Theme.setTheme(name)

    return {
      message: 'Current theme updated',
    }
  }
}
