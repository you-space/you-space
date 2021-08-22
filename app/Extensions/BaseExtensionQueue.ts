import Redis from '@ioc:Adonis/Addons/Redis'
import Queue from '@ioc:Queue'

import { cuid } from '@ioc:Adonis/Core/Helpers'

import { importIfExist } from 'App/Services/Helpers'
import { DoneCallback, Job, JobOptions } from 'bull'
import { This } from './typings'
import { pick } from 'lodash'

export interface ExtensionJobOptions {
  [prop: string]: any
  path: string
  method: string
  jobId?: string
  jobOptions?: JobOptions
}

export default class BaseExtensionQueue {
  public static queueName = 'unknown'

  public static get key() {
    return `ys:ext:${this.queueName}:jobs`
  }

  public static async process<T extends This<typeof BaseExtensionQueue>>(
    this: T,
    job: Job<ExtensionJobOptions>,
    done: DoneCallback
  ) {
    const { path, method, args } = job.data

    const Class = await importIfExist(path)

    if (!Class) {
      return done(new Error('file not found'))
    }

    const instance = new Class()

    if (!instance[method]) {
      return done(new Error('method not found'))
    }

    instance[method](args || {})

    done()
  }

  public static getQueue() {
    let queue = Queue.findQueue(this.key)

    if (!queue) {
      queue = Queue.addQueue(this.key, this.process)

      queue.on('completed', (job) => {
        if (job.opts.removeOnComplete) {
          Redis.del(`${this.key}:${job.data.jobId}`)
        }
      })
    }

    return queue
  }

  public static async getAllJobs() {
    const keys = await Redis.keys(`${this.key}:*`)

    const jobs = await Promise.all(keys.map((k) => Redis.get(k)))

    return jobs.map((j) => JSON.parse(j as string)) as ExtensionJobOptions[]
  }

  public static async addJob(options: Partial<ExtensionJobOptions>) {
    options.jobId = options.jobId || cuid()

    await Redis.set(`${this.key}:${options.jobId}`, JSON.stringify(options))

    await this.refresh()
  }

  public static async refresh() {
    const jobs = await this.getAllJobs()

    const queue = this.getQueue()

    await queue.empty()
    await queue.clean(0)

    setTimeout(() => {
      jobs.forEach((job) => queue.add({ ...job }, job.jobOptions))
    }, 5000)
  }

  public static $mountQueue() {
    return pick(this, [
      'key',
      'queueName',
      'process',
      'addJob',
      'refresh',
      'getAllJobs',
      'getQueue',
    ])
  }
}
