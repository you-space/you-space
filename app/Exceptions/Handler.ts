/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async report(error: any) {
    Logger.error(error)
  }

  public async handle(error: any, { response, request }: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return response.status(422).send(error.messages)
    }

    if (request.url().includes('/api/')) {
      const status = error.status || 500

      return response.status(status).json({
        status: status,
        code: error.code,
        message: error.message || 'Internal server error',
        stack: Env.get('NODE_ENV') === 'development' ? error.stack : undefined,
      })
    }

    return response.redirect('/404')
  }
}
