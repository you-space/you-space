import Bull from 'bull'
import { join } from 'path'

import Logger from '@ioc:Adonis/Core/Logger'
import { requireAll } from '@ioc:Adonis/Core/Helpers'

const jobs = requireAll(join(__dirname, 'jobs')) || {}

export interface QueueHandler<T> {
  key: string
  handler: Bull.ProcessCallbackFunction<T>
}

export default class Queue {
  public queues = Object.values(jobs).map((queueHandler: QueueHandler<any>) => {
    const bull = new Bull(queueHandler.key)

    bull.process(queueHandler.handler)

    bull.on('error', Logger.error)

    bull.on('completed', (job) => {
      Logger.child(job.data).info('%s completed', queueHandler.key)
    })

    return {
      name: queueHandler.key,
      handler: queueHandler.handler,
      bull,
    }
  })

  constructor() {
    Logger.info('queue service started')
  }

  public findQueue(name: string) {
    const queue = this.queues.find((q) => q.name === name)

    if (!queue) {
      throw new Error('queue not found')
    }

    return queue.bull
  }
}
