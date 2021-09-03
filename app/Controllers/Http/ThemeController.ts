import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Queue from '@ioc:Queue'

import Theme from 'App/Extensions/Theme'
import RunThemeScript from 'App/Queue/jobs/RunThemeScript'

export default class ThemeController {
  public async index() {
    const themes = await Theme.all()

    const activeTheme = await Theme.findCurrentThemeName()

    return themes.map((t) => {
      const scripts: string[] = []

      t.scripts?.forEach((_, key) => scripts.push(key))

      return {
        name: t.name,
        active: t.name === activeTheme,
        scripts,
      }
    })
  }

  public async store({ request }: HttpContextContract) {
    const { githubUrl } = await request.validate({
      schema: schema.create({
        githubUrl: schema.string({}, [
          rules.url({
            allowedHosts: ['github.com'],
          }),
        ]),
      }),
    })

    await Theme.create(githubUrl)

    return {
      message: 'Theme downloaded',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const theme = await Theme.findOrFail(params.id)

    const isActive = await theme.isActive()

    if (isActive) {
      throw new Error('can not delete active theme')
    }

    await theme.delete()

    return {
      message: 'Theme deleted',
    }
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

  public async executeScripts({ request, params }: HttpContextContract) {
    const { scripts } = await request.validate({
      schema: schema.create({
        scripts: schema.array().members(schema.string()),
      }),
    })

    const theme = await Theme.findOrFail(params.name)

    scripts.forEach((s) => {
      if (!theme.scripts?.get(s)) {
        throw new Error(`script ${s} not found`)
      }
    })

    scripts.forEach((s) => {
      Queue.add(RunThemeScript.key, {
        themeName: theme.name,
        scriptName: s,
      })
    })

    return {
      message: 'sign to run scripts sended',
    }
  }
}
