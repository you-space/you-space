import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin from 'App/Models/Origin'
export default class OriginLogsController {
  public async index({ params }: HttpContextContract) {
    const origin = await Origin.query().preload('logs').where('id', params.origin_id).firstOrFail()

    return origin.logs
  }
}
