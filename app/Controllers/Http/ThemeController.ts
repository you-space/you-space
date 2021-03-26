import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import { promisify } from 'util'

export default class ThemeController {
  public async show({ request, response }: HttpContextContract) {
    const themePath = Application.makePath('content/themes/vue-ssr/setup')
    const setup = require(themePath)
    await setup.handler(request, response)
    // console.log(handler)
    return themePath
  }

  public showStatic({ request, response }: HttpContextContract) {
    const themePath = Application.makePath('content/themes/vue-ssr/setup')

    const filename = request.url().replace('/theme/static/', '')
    const filePath = Application.makePath('content/themes/vue-ssr/dist', filename)

    if (filename.includes('.js')) {
      response.safeHeader('Content-type', 'text/javascript')
    }

    return promisify(fs.readFile)(filePath)

    // console.log(filePath)

    // const includes = [
    //   {
    //     name: 'css/app.d40fc157.css',
    //     path: Application.makePath('content/themes/vue-ssr/dist/css/app.d40fc157.css'),
    //   },
    //   {
    //     name: 'img/logo.82b9c7a5.png',
    //     path: Application.makePath('content/themes/vue-ssr/dist/img/logo.82b9c7a5.png'),
    //   },
    //   {
    //     name: 'js/app.1772a0ba.js',
    //     path: Application.makePath('content/themes/vue-ssr/dist/js/app.1772a0ba.js'),
    //     content: 'text/javascript',
    //   },
    // ]

    // const findInclude = includes.find((i) => i.name === filePath)

    // console.log(findInclude)

    // if (!findInclude) {
    //   throw new Error('not found')
    // }

    // if (findInclude.content) {
    //   response.safeHeader('Content-type', findInclude.content)
    // }

    // return promisify(fs.readFile)(findInclude.path)
  }
}
