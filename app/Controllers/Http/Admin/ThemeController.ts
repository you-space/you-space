import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { promisify } from 'util'

export default class ThemeController {
  public async index({}: HttpContextContract) {
    const themesPath = Application.makePath('content', 'themes')
    const context = await promisify(fs.readdir)(themesPath)
    const themesInformation = await Promise.all(
      context.map(async (themesName) => {
        const configPath = `${themesPath}/${themesName}/ys-config.json`
        const configExist = await promisify(fs.exists)(configPath)
        if (!configExist) {
          return {
            name: themesName,
          }
        }
        return require(configPath)
      })
    )
    return themesInformation
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
