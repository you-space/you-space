import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Origin from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'
import SystemMeta from 'App/Models/SystemMeta'

import Provider from 'App/Extensions/Provider'
import Queue from '@ioc:Queue'
import OriginScheduleImport from 'App/Queue/jobs/OriginScheduleImport'

export default class OriginsController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('page', 20)

    const pagination = await Origin.query().paginate(page, limit)

    const data = await Promise.all(
      pagination.all().map(async (o) => {
        const provider = await Provider.find(o.providerName)

        return {
          ...o.serialize(),
          valid: !!provider,
          fields: provider?.fields || [],
          options: provider?.options,
        }
      })
    )

    return {
      meta: pagination.getMeta(),
      data,
    }
  }

  public async show({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const provider = await Provider.find(origin.providerName)

    return {
      valid: !!provider,
      fields: provider?.fields || [],
      ...origin?.serialize(),
    }
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(OriginValidator)

    return await Origin.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const { schedule, ...data } = await request.validate(OriginUpdateValidator)

    Object.assign(origin, data)

    await origin.save()

    return {
      status: 200,
      message: 'Origin updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    await origin.delete()

    return {
      status: 200,
      message: 'Origin deleted',
    }
  }

  public async providers() {
    const metas = await SystemMeta.fetchByName('providers:*')

    return metas.map((m) => {
      const name = m.name.split(':').pop()

      return {
        id: m.name,
        name,
      }
    })
  }

  public async import({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const queue = Queue.findOrFail(OriginScheduleImport.key)

    queue.add({
      originId: origin.id,
    })

    return {
      message: 'import started',
    }
  }
}
