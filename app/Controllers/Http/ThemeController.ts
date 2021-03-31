import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import Video from 'App/Models/Video'
import { getThemeMachine } from 'App/Services/ThemeMachine'

export default class ThemeController {
  public async show({ params, request, response }: HttpContextContract) {
    const staticRoutes = {
      '/': 'index',
      '/video-list': 'archive',
    }

    const templateName = staticRoutes[request.url()] || '404'

    const machine = await getThemeMachine()

    const template = await machine.getTemplate(templateName)

    return template.render(machine)
  }

  public async showStatic({ request, response }: HttpContextContract) {
    const types = {
      js: 'text/javascript',
    }

    const filename = request.url().replace('/theme/static', '')
    const extname = path.extname(filename).replace('.', '')

    if (types[extname]) {
      response.safeHeader('Content-type', types[extname])
    }

    const machine = await getThemeMachine()

    const file = await machine.getThemeStaticFile(filename)

    return file || '404'
  }

  public async showSingle({ params, request, response }: HttpContextContract) {
    const video = await Video.find(params.id)
    const templateName = video ? 'video-single' : '404'

    const machine = await getThemeMachine()

    const template = await machine.getTemplate(templateName)

    return template.render(machine, video ? video.serialize() : null)
  }
}
