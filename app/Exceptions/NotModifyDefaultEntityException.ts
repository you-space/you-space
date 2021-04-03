import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class NotModifyDefaultEntityException extends Exception {
  public async handle(error: this, { response }: HttpContextContract) {
    const status = 400
    response.status(status).json({
      status: status,
      code: 'E_NOT_MODIFY_DEFAULT_ENTITY',
      message: error.message || 'Sorry you are not allowed to view this content',
      stack: Env.get('NODE_ENV') === 'development' ? error.stack : undefined,
    })
  }
}
