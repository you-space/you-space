import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import { getThemeMachine } from 'App/Services/ThemeMachine'
import ContentVideo from 'App/Services/Content/ContentVideos'

export default class ThemeController {
  public async show({ params, request, response }: HttpContextContract) {
    const staticRoutes = {
      '/': 'index',
      '/video-list': 'archive',
    }

    const templateName = staticRoutes[request.url()] || '404'

    if (templateName === '404') {
      response.status(404)
    }

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

  public async showSingle({ params, auth }: HttpContextContract) {
    const video = await ContentVideo.show(params.id, auth.user)

    const templateName = video ? 'video-single' : '404'

    const machine = await getThemeMachine()

    const template = await machine.getTemplate(templateName)

    return template.render(machine, video)
  }
}
