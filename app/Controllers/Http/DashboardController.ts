import { promises as fs } from 'fs'
import path from 'path'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Space from 'App/Services/Space'
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
      return await fs.readFile(`${appPath}${filename}`)
    }

    response.safeHeader('Content-type', 'text/html')

    return await fs.readFile(`${appPath}/index.html`, 'utf-8')
  }

  public async findPages() {
    const pages = await Space.emit('space:pages:index')

    return pages.map((p) => ({
      name: p.name,
      label: p.label,
      icon: p.icon,
    }))
  }

  public async showPage({ params, response }: HttpContextContract) {
    const page = await Space.emit('space:pages:get', params.name)

    if (!page) {
      return response.notFound('Page not found')
    }

    const exist = await Drive.exists(page.filename)

    if (!exist) {
      return response.notFound('Page file not found')
    }

    const file = await Drive.get(page.filename)

    response.type('js')

    return file.toString()
  }
}
