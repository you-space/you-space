import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Theme } from 'App/Listeners/ThemeListener'
import SystemMeta from 'App/Models/SystemMeta'
import Space from 'App/Services/SpaceService'
import { ThemeContext } from 'App/Services/ThemeContext'

export default class ClientController {
  public async index(context: HttpContextContract) {
    const themeId = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    if (!themeId) {
      return context.response.internalServerError({
        message: 'Theme not defined',
      })
    }

    const theme = await Space.emit<Theme>('theme:show', themeId[0])

    if (!theme) {
      return context.response.internalServerError({
        message: 'Theme not found',
      })
    }

    const { render } = await import(theme.filename)

    const themeContext = await ThemeContext.mount(context)

    return render(themeContext)
  }
}
