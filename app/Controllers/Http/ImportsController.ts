import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Provider from 'App/Extensions/Provider'
import Origin from 'App/Models/Origin'

export default class ImportsController {
  public async import({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const provider = await Provider.findOrFail(origin.providerName)

    provider.useOrigin(origin)

    provider.import()

    return {
      message: 'import started',
    }
  }
}
