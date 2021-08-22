import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Origin from 'App/Models/Origin'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'
import SystemMeta from 'App/Models/SystemMeta'
import Queue from '@ioc:Queue'
import Provider from 'App/Extensions/Provider'

export default class OriginsController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('page', 20)

    const providers = await Origin.fetchProviders(true)

    const pagination = await Origin.query().paginate(page, limit)

    const data = await Promise.all(
      pagination.all().map((o) => {
        let provider = providers.find((p) => p.name === o.providerName)
        return {
          ...provider,
          ...o.serialize(),
        }
      })
    )

    return {
      meta: pagination.getMeta(),
      data,
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

    await Provider.importOrigin(origin)

    return {
      message: 'Data imported',
    }
  }

  public async showSchedulerImport({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const provider = await origin.findProvider()

    if (provider?.options?.includes('import')) {
      throw new Error('Provider do not have import methods')
    }

    const queue = Queue.findQueue('origin-schedule-import')

    const allJobs = await queue.getJobs(['delayed', 'waiting'])

    const job = allJobs.find((j) => j.data.originId === origin.id)

    const logs = job ? await queue.getJobLogs(job.id) : {}

    return {
      repeatEach: job?.data.repeatEach || 'none',
      ...logs,
    }
  }

  public async updateSchedulerImport({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const { repeatEach } = await request.validate({
      schema: schema.create({
        repeatEach: schema.enum(['minute', 'hour', 'day', 'none']),
      }),
    })

    const provider = await origin.findProvider()

    console.log(provider)

    Provider.importOrigin(origin)

    return {
      message: 'Origin import updated',
    }
  }
}
