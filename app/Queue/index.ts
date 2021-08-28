import Bull, { Job, JobOptions } from 'bull'
import Logger from '@ioc:Adonis/Core/Logger'
import OriginScheduleImport from './jobs/OriginScheduleImport'
import ProviderJobs from './jobs/ProviderJobs'

export interface QueueHandler {
  name: string
  handler: Bull.ProcessCallbackFunction<any>
  bull: Bull.Queue
}

export default class Queue {
  public queues: QueueHandler[] = []

  constructor() {
    Logger.info('queue service started')

    this.addQueue(OriginScheduleImport.key, OriginScheduleImport.handler)
    this.addQueue(ProviderJobs.key, ProviderJobs.handler)
  }

  public find<T = Record<string, any>>(name: string) {
    const queue = this.queues.find((q) => q.name === name)

    return queue ? (queue.bull as Bull.Queue<T>) : null
  }

  public findOrFail<T = Record<string, any>>(name: string) {
    const queue = this.find<T>(name)

    if (!queue) {
      throw new Error('queue not found')
    }

    return queue
  }

  public addQueue<T = Record<string, any>>(
    name: string,
    callback: Bull.ProcessCallbackFunction<T>
  ) {
    const queue = new Bull<T>(name)

    queue.process(callback)

    queue.on('completed', () => Logger.debug('%s complete', name))
    queue.on('error', (err) => Logger.error(err.message))
    queue.on('failed', (err) =>
      Logger.child({
        queueName: name,
        data: err.data,
      }).error(err.failedReason || `job failed`)
    )

    this.queues.push({
      name,
      handler: callback,
      bull: queue,
    })

    return queue
  }

  public add(queueName: string, data: any, options?: JobOptions) {
    const queue = this.findOrFail(queueName)

    return queue.add(data, options)
  }

  public async status() {
    const allJobs: Job[] = []

    await Promise.all(
      this.queues.map(async ({ bull }) => {
        const jobs = await bull.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed'])
        allJobs.push(...jobs)
      })
    )

    return await Promise.all(
      allJobs
        .filter((j) => !!j)
        .map(async (job) => ({
          id: job.id,
          name: job.name,
          queueName: job.queue.name,
          date: new Date(job.timestamp).toISOString(),
          status: await job.getState(),
          failedReason: job.failedReason,
          data: job.data,
          options: job.opts,
        }))
    )
  }
}
