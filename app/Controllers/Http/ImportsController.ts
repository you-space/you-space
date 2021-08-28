import lodash from 'lodash'
import Redis from '@ioc:Adonis/Addons/Redis'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Queue from '@ioc:Queue'
import Origin from 'App/Models/Origin'
import OriginScheduleImport from 'App/Queue/jobs/OriginScheduleImport'

export default class ImportsController {
  public async import({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const queue = Queue.findOrFail(OriginScheduleImport.key)

    queue.add(
      {
        originId: origin.id,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    )

    return {
      message: 'import started',
    }
  }

  public async showSchedule({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const key = `origins:import:schedule:${origin.id}`

    return {
      repeatEach: (await Redis.get(`${key}:repeatEach`)) || 'none',
    }
  }

  public async schedule({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)
    const key = `origins:import:schedule:${params.id}`

    const options = {
      minute: '* * * * *',
      hour: '0 * * * *',
      day: '0 0 * * *',
      month: '0 0 1 * *',
      week: '0 0 * * 0',
    }

    const { repeatEach } = await request.validate({
      schema: schema.create({
        repeatEach: schema.enum([...Object.keys(options), 'none']),
      }),
    })

    const lastJobKey = await Redis.get(key)

    const queue = Queue.findOrFail(OriginScheduleImport.key)

    if (lastJobKey) {
      await queue?.removeRepeatableByKey(lastJobKey)
      await Redis.del(key)
      await Redis.del(`${key}:repeatEach`)
    }

    if (options[repeatEach]) {
      const job = await queue.add(
        {
          originId: origin.id,
        },
        {
          removeOnFail: true,
          repeat: {
            cron: options[repeatEach],
          },
        }
      )

      await Redis.set(key, lodash.get(job, 'opts.repeat.key', null))
      await Redis.set(`${key}:repeatEach`, repeatEach)
    }

    return {
      message: 'schedule updated',
    }
  }
}
