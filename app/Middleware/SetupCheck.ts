import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class CheckDatabaseConnection {
  public async handle({ response, request }: HttpContextContract, next: () => Promise<void>) {
    const haveEnv = Env.get('PG_DB_NAME')

    if (haveEnv && request.url() === '/setup') {
      return response.redirect().toPath('/')
    }

    if (!haveEnv && request.url() !== '/setup') {
      return response.redirect().toPath('/setup')
    }

    await next()
  }
}
