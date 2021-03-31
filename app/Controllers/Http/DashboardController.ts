import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class DashboardController {
  public async show({ request, response }: HttpContextContract) {
    const appPath = Application.publicPath('dist/spa')
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
}