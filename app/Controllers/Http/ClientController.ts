import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Theme } from 'App/Listeners/ThemeListener'
import Space from 'App/Services/SpaceService'
export default class ClientController {
  public async show({ request, response }: HttpContextContract) {
    const theme = await Space.emit<Theme>('theme:show', 'youtube-theme')

    if (!theme) {
      return response.status(404).send('No theme')
    }

    const context = {
      headers: new Map<string, string>(),
      url: request.url(true),
    }

    const { render } = await import(theme.filename)

    const content = await render(context)

    context.headers.forEach((value, name) => {
      response.safeHeader(name, value)
    })

    return content
  }
}
