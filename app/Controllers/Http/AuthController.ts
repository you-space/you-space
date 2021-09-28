import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async show({ auth }: HttpContextContract) {
    return auth.user
  }

  public async login({ request, auth }: HttpContextContract) {
    const uuid = request.input('emailOrUsername')
    const password = request.input('password')

    await auth.use('web').attempt(uuid, password)

    return {
      message: 'Login success',
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect('/')
  }
}
