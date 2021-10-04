import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Space from 'App/Services/Space'

export default class SpaceMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const roles = await auth.user?.related('roles').query()

    Space.roles = roles ? roles.map((r) => r.name) : []

    await next()

    Space.roles = ['*']
  }
}
