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
      url: request.url(true),
      response,
    }

    const { render } = await import(theme.filename)

    const content = await render(context)

    return content
  }
}
