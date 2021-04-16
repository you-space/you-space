import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import { getThemeMachine } from 'App/Services/ThemeMachine'
import fs from 'fs'
import { promisify } from 'util'

export default class ThemeController {
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
