import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'
import PluginHelper from '@ioc:Providers/PluginHelper'
import SystemMeta from 'App/Models/SystemMeta'

export default class OriginsController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('page', 20)

    const providers = await PluginHelper.fetchProviders()

    const pagination = await Origin.query().paginate(page, limit)

    const origins = await Promise.all(
      pagination.all().map((o) => {
        let provider = providers.find((p) => p.name === o.providerName)
        return {
          ...provider,
          ...o.serialize(),
        }
      })
    )

    return {
      data: origins,
      meta: pagination.getMeta(),
    }
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(OriginValidator)

    return await Origin.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const updateData = await request.validate(OriginUpdateValidator)

    Object.assign(origin, updateData)

    await origin.save()

    return {
      status: 200,
      message: 'Origin updated',
    }
  }

  public async providers() {
    const metas = await SystemMeta.fetchByName('plugins:*:providers:*')

    return metas.map((m) => {
      const name = m.name.split(':').pop()

      return {
        name,
        ...JSON.parse(m.value),
      }
    })
  }

  public async import({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const provider = await PluginHelper.findProvider(origin.providerName)

    if (!provider) {
      throw new Error('provider not found')
    }

    if (!provider.options.includes('import')) {
      throw new Error('provider not have option import')
    }

    const instance = await PluginHelper.createProviderInstance(origin)

    if (!instance.import) {
      throw new Error('provider is missing import method')
    }

    await instance.import()

    return {
      message: 'Data imported',
    }
  }
}
