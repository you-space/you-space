import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import path from 'path'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { promisify } from 'util'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import execa from 'execa'

export default class ThemeController {
  public async index() {
    const currentTheme = await YsOption.findBy('name', BaseOptions.CurrentTheme)
    const themesPath = Application.makePath('content', 'themes')
    const context = await promisify(fs.readdir)(themesPath)

    return await Promise.all(
      context.map(async (themesName) => {
        const configPath = `${themesPath}/${themesName}/ys-config.json`
        const configFileExist = await promisify(fs.exists)(configPath)

        let config = {
          name: themesName,
          isCurrent: currentTheme ? currentTheme.value === themesName : false,
        }

        if (!configFileExist) {
          return config
        }

        const configFile = require(configPath)

        return {
          ...configFile,
          ...config,
          displayName: configFile.name,
        }
      })
    )
  }

  public async setTheme({ request }: HttpContextContract) {
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const themesPath = Application.makePath('content', 'themes', name)
    const exists = await promisify(fs.exists)(themesPath)

    if (!exists) {
      throw new Error('theme not exist')
    }

    await YsOption.updateOrCreate(
      {},
      {
        name: BaseOptions.CurrentTheme,
        value: name,
      }
    )
  }

  public async store({ request }: HttpContextContract) {
    const { githubUrl } = await request.validate({
      schema: schema.create({
        githubUrl: schema.string({}, [rules.url()]),
      }),
    })

    const repoName = path.basename(githubUrl).replace('.git', '')

    const themesPath = Application.makePath('content', 'themes', repoName)

    await execa('git', ['clone', githubUrl, themesPath], {
      stdio: 'inherit',
    })
  }
}
