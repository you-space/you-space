import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async store({ request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const userExist = await User.query().where('email', email).first()

    if (userExist) {
      throw new Error('EMAIL_ALREADY_USED')
    }

    await User.create({
      email,
      password,
    })
  }
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }
}
