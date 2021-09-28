import { promises as fs } from 'fs'
import path from 'path'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SystemMeta from 'App/Models/SystemMeta'
import Drive from '@ioc:Adonis/Core/Drive'
import { Page } from 'App/Services'
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
    const metas = await SystemMeta.fetchByName('pages:*')

    return metas
      .map((m) => m.toMetaObject<Page>())
      .map((m) => ({
        name: m.name,
        label: m.label,
        icon: m.icon,
      }))
  }

  public async showPage({ params, response }: HttpContextContract) {
    const meta = await SystemMeta.findMetaObject<Page>(`pages:${params.name}`)

    if (!meta) {
      return response.notFound('Page not found')
    }

    const exist = await Drive.exists(meta.filename)

    if (!exist) {
      return response.notFound('Page file not found')
    }

    const file = await Drive.get(meta.filename)

    response.type('js')

    return file.toString()
  }
}
