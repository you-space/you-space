import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Queue from '@ioc:Queue'
import OriginScheduleImport from 'App/Queue/jobs/OriginScheduleImport'

export default class JobsController {
  public index() {
    return Queue.status()
  }

  public async update({ request }: HttpContextContract) {
    const { jobs, action } = await request.validate({
      schema: schema.create({
        action: schema.enum(['delete']),
        jobs: schema.array().members(
          schema.object().members({
            queueName: schema.string(),
            jobId: schema.string(),
          })
        ),
      }),
    })

    await Promise.all(
      jobs.map(async ({ jobId, queueName }) => {
        const queue = Queue.findOrFail(queueName)

        const job = await queue.getJob(jobId)

        if (!job) return

        if (action === 'delete') {
          await job.remove()
        }
      })
    )

    let message = 'jobs updated'

    if (action === 'cancel') {
      message = 'jobs canceled'
    }

    if (action === 'delete') {
      message = 'jobs deleted'
    }

    return {
      message,
    }
  }
}
