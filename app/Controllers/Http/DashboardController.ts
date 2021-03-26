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

    if (filename === '/' || filename === '') {
      const html = await promisify(fs.readFile)(`${appPath}/index.html`, 'utf-8')
      response.safeHeader('Content-type', 'text/html')

      return html
    }

    const headers = {
      js: 'text/javascript',
      css: 'text/css',
    }

    if (headers[extname]) {
      response.safeHeader('Content-type', headers[extname])
    }

    const file = await promisify(fs.readFile)(`${appPath}${filename}`)

    return file
  }
}
