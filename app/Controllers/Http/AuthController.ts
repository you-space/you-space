import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async show({ auth }: HttpContextContract) {
    return auth.user
  }

  public async login({ request, auth }: HttpContextContract) {
    const { uuid, password } = await request.validate({
      schema: schema.create({
        uuid: schema.string(),
        password: schema.string(),
      }),
    })

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
