import Logger from '@ioc:Adonis/Core/Logger'
import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OriginException extends Exception {
  constructor(message: string, protected type: string, protected originName?: string) {
    super(message, 400)
  }

  public async handle(error: this, { response }: HttpContextContract) {
    Logger.child({ type: this.type, originName: this.originName }).error(error.message)

    response.status(error.status).json({
      status: error.status,
      code: 'E_ORIGIN_ERROR',
      message: error.message || 'Sorry you are not allowed to view this content',
    })
  }
}
