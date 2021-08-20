import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class CheckDatabaseConnection {
  public async handle({ response, request }: HttpContextContract, next: () => Promise<void>) {
    const haveDatabase = Env.get('PG_DB_NAME', false)

    if (haveDatabase && request.url() === '/setup') {
      return response.redirect().toPath('/')
    }

    if (!haveDatabase && request.url() !== '/setup') {
      return response.redirect().toPath('/setup')
    }

    await next()
  }
}
