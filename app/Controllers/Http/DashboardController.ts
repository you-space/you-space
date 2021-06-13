import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ItemType from 'App/Models/ItemType'
export default class DashboardController {
  public async show({ request, response }: HttpContextContract) {
    const appPath = Application.publicPath()
    const filename = request.url().replace('/ys-admin', '')
    const extname = path.extname(filename).replace('.', '')

    const headers = {
      js: 'text/javascript',
      css: 'text/css',
      png: 'image/png',
      woff: 'text',
    }

    if (headers[extname]) {
      response.safeHeader('Content-type', headers[extname])
      return await promisify(fs.readFile)(`${appPath}${filename}`)
    }

    response.safeHeader('Content-type', 'text/html')

    return await promisify(fs.readFile)(`${appPath}/index.html`, 'utf-8')
  }

  public async showMenu() {
    const types = await ItemType.query()
      .whereRaw(`"options"->'showInMenu' = 'true'`)
      .whereNull('deletedAt')

    return types.map((type) => ({
      name: type.name,
      label: type.options.label || type.name,
      icon: type.options.icon,
    }))
  }
}
