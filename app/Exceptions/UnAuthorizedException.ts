import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Env from '@ioc:Adonis/Core/Env'
export default class UnAuthorizedException extends Exception {
  constructor(message: string) {
    super(message, 401)
  }

  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).json({
      status: error.status,
      code: 'E_NOT_ALLOWED',
      message: error.message || 'Sorry you are not allowed to view this content',
      stack: Env.get('NODE_ENV') === 'development' ? error.stack : undefined,
    })
  }
}
