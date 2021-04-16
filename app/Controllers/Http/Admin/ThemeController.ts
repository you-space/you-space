import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { promisify } from 'util'
import YsOption, { BaseOptions } from 'App/Models/YsOption'

export default class ThemeController {
  public async index({}: HttpContextContract) {
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
          ...config,
          ...configFile,
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

  public async show({}: HttpContextContract) {
    throw new Error('themes are working in progress')

    // const types = {
    //   js: 'text/javascript',
    //   map: 'text/javascript',
    //   css: 'text/css',
    //   png: 'image/png',
    //   ico: 'image/x-icon',
    // }

    // const filename = request.url()
    // const extname = path.extname(request.url()).replace('.', '')

    // const machine = await getThemeMachine()

    // const themeFiles = machine.staticFiles()

    // if (types[extname] && Object.keys(themeFiles).includes(filename)) {
    //   response.safeHeader('Content-type', types[extname])

    //   return await promisify(fs.readFile)(themeFiles[filename])
    // }

    // return machine.render({ request, response })
  }
}
