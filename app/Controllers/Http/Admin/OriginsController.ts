import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OriginService from '@ioc:Providers/OriginService'
import OriginQueue from '@ioc:Providers/Queue/OriginQueue'
import NotModifyDefaultEntityException from 'App/Exceptions/NotModifyDefaultEntityException'
import OriginException from 'App/Exceptions/OriginException'

import Origin, { OriginConfig, OriginTypes } from 'App/Models/Origin'
import OriginProvider from 'App/Services/Origin/OriginProvider'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'
import OriginValidator from 'App/Validators/OriginValidator'

export default class OriginsController {
  public async index() {
    const origins = await Origin.query().preload('metadata').withCount('videos')

    return origins.map((o) => ({
      ...o.serialize(),
      videosCount: Number(o.$extras.videos_count),
    }))
  }

  public async store({ request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginValidator)

    const isValid = await OriginService.checkConfig(type, config)

    if (!isValid) {
      throw new OriginException('config invalid', type)
    }

    return await Origin.create({
      name,
      type,
      config: config as OriginConfig,
    })
  }

  public async show({ params }: HttpContextContract) {
    const origin = await Origin.query()
      .where('id', params.id)
      .withCount('videos')
      .preload('metadata')
      .firstOrFail()

    return {
      ...origin.serialize(),
      videosCount: Number(origin.$extras.videos_count),
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const { name, type, config } = await request.validate(OriginUpdateValidator)
    const origin = await Origin.findOrFail(params.id)

    if (type === OriginTypes.Main) {
      throw new Error("can't set main origin")
    }

    if (type) {
      origin.type = type
    }

    if (name) {
      origin.name = name
    }

    if (config) {
      await OriginProvider.checkConfig(config as OriginConfig)
      origin.config = config as OriginConfig
    }

    await origin.save()

    return origin
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)
    if (origin.type === OriginTypes.Main) {
      throw new NotModifyDefaultEntityException("can't delete main origin")
    }
    await origin.delete()
  }

  public async startImport({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)
    const provider = OriginService.getProvider(origin)
    if (provider.preload) {
      await provider.preload(origin.config)
    }

    const totalPages = await provider.getTotalPages()

    const jobs: any[] = []

    for (let i = 1; i <= totalPages; i++) {
      jobs.push({
        originId: origin.id,
        page: i,
        delay: i * 1000,
      })
    }

    jobs.forEach((job) => OriginQueue.addVideoPageImport(job.originId, job.page, job.delay))
  }
}
