import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Space from 'App/Services/SpaceService'

export default class JobsController {
  public async index() {
    return Space.emit('job:index')
  }

  public async show({ params, response }: HttpContextContract) {
    const job = await Space.emit('job:show', params.id)

    if (!job) {
      return response.notFound({
        message: 'Job not found',
      })
    }

    return job
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('job:destroy', params.id)

    return {
      message: 'Job deleted',
    }
  }
}
