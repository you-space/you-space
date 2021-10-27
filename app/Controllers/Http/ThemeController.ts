import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { Theme } from 'App/Listeners/ThemeListener'
import Space from 'App/Services/SpaceService'
import { pick } from 'lodash'

export default class ThemeController {
  public async index() {
    const themes = (await Space.emit<Theme[]>('theme:index')) || []

    return themes.map((theme) => pick(theme, ['id', 'name', 'active', 'description', 'scripts']))
  }

  public async store({ request }: HttpContextContract) {
    const { gitUrl } = await request.validate({
      schema: schema.create({
        gitUrl: schema.string({}, [
          rules.url({
            allowedHosts: ['github.com'],
          }),
        ]),
      }),
    })

    await Space.emit('theme:store', gitUrl)

    return {
      message: 'Theme downloaded',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('theme:destroy', params.id)

    return {
      message: 'Theme deleted',
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const theme = await Space.emit<Theme>('theme:show', params.id)

    if (!theme) {
      throw new Error('Theme not found')
    }

    const { active } = await request.validate({
      schema: schema.create({
        active: schema.boolean(),
      }),
    })

    await Space.emit('theme:update', {
      name: theme.name,
      active,
    })

    return {
      message: 'Current theme updated',
    }
  }
}
