import path from 'path'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Theme from 'App/Extensions/Theme'
export default class ClientController {
  public async assets({ params, response }: HttpContextContract) {
    const theme = await Theme.findCurrentTheme()

    const name = params['*'].join('/')
    const asset = theme?.assets?.get(name)

    if (!asset || !(await Drive.exists(asset))) {
      return response.redirect('/404')
    }

    response.type(path.extname(asset))

    return Drive.get(asset)
  }

  public async show({ request, auth }: HttpContextContract) {
    const theme = await Theme.findCurrentTheme()

    if (!theme) {
      return 'No theme'
    }

    let path = request.url()

    if (path.length > 1 && path.charAt(path.length - 1) === '/') {
      const newPath = path.split('/')

      newPath.pop()

      path = newPath.join('/')
    }

    return theme.render({
      path,
      fullPath: request.url(true),
      params: request.params()['*'] || [],
      query: request.qs(),
      user: auth.user?.serialize(),
      site: {
        title: 'You space',
      },
    })
  }
}
