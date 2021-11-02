import fastq from 'fastq'
import Logger from '@ioc:Adonis/Core/Logger'
import UploadWorker from './workers/Upload'
import { cuid } from '@ioc:Adonis/Core/Helpers'

interface JobOptions {
  queue: string
  jobId?: string
  args?: any
}

interface Job {
  jobId: string
  args: any
  queue?: string
  status: 'pending' | 'done' | 'failed'
}

export class QueueService {
  public queues: Map<string, fastq.queueAsPromised> = new Map()
  public jobs: Map<string, Job> = new Map()

  public start() {
    Logger.info(`[queue] queue service started`)
    this.addQueue('upload', UploadWorker)
  }

  public addQueue(name: string, worker: fastq.asyncWorker<any>) {
    if (this.queues.has(name)) {
      Logger.error(`[queue] queue ${name} already exists`)
      return
    }

    const queue = fastq.promise(worker, 1)

    this.queues.set(name, queue)

    Logger.info(`[queue] queue ${name} added`)
  }

  public updateJob(jobId: string, options: Partial<Job>) {
    const job = this.jobs.get(jobId)

    if (!job) {
      Logger.error(`[queue] job ${jobId} does not exist`)
      return
    }

    this.jobs.set(jobId, {
      ...job,
      ...options,
    })
  }

  public addJob(options: Exclude<JobOptions, 'status'>) {
    const jobId = options.jobId || cuid()
    const queue = this.queues.get(options.queue)

    if (this.jobs.has(jobId)) {
      throw new Error(`[queue] job ${jobId} already exists`)
    }

    if (!queue) {
      throw new Error(`[queue] queue ${options.queue} does not exist`)
    }

    this.jobs.set(jobId, {
      jobId,
      status: 'pending',
      args: options.args,
    })

    queue
      .push(options.args)
      .catch(() => this.updateJob(jobId, { status: 'failed' }))
      .then(() => this.updateJob(jobId, { status: 'done' }))

    return jobId
  }
}

export const Queue = new QueueService()

export default Queue
