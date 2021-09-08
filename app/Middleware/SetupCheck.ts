import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'

export default class CheckDatabaseConnection {
  public async handle({ response, request }: HttpContextContract, next: () => Promise<void>) {
    const haveEnv = await Drive.exists(Application.makePath('.env'))

    if (haveEnv && request.url() === '/setup') {
      return response.redirect().toPath('/')
    }

    if (!haveEnv && request.url() !== '/setup') {
      return response.redirect().toPath('/setup')
    }

    await next()
  }
}
