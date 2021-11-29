import fastq from 'fastq'
import Logger from '@ioc:Adonis/Core/Logger'
import UploadWorker from './workers/Upload'
import ImportWorker from './workers/Import'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { Job } from './Job'

interface JobOptions {
  queue: string
  jobId?: string
  args?: any
}

export class QueueService {
  public queues: Map<string, fastq.queueAsPromised> = new Map()
  public jobs: Map<string, Job> = new Map()
  public booted = false

  public start() {
    if (this.booted) {
      return
    }

    Logger.info(`[queue] queue service started`)

    this.addQueue('upload', UploadWorker)
    this.addQueue('import', ImportWorker)

    this.booted = true
  }

  public addQueue(name: string, worker: fastq.asyncWorker<any>) {
    if (this.queues.has(name)) {
      throw new Error(`Queue ${name} already exists`)
    }

    const queue = fastq.promise(this.workerMiddleware(worker), 1)

    this.queues.set(name, queue)

    Logger.info(`[queue] queue ${name} added`)

    return queue
  }

  public workerMiddleware(worker: fastq.asyncWorker<any>) {
    return (jobId: string) => {
      const job = this.jobs.get(jobId)

      if (!job) {
        return Promise.resolve()
      }

      job.status = 'active'

      return worker(job)
    }
  }

  public addJob(options: JobOptions) {
    const jobId = options.jobId || cuid()
    const queue = this.queues.get(options.queue)

    if (this.jobs.has(jobId)) {
      throw new Error(`Job ${jobId} already exists`)
    }

    if (!queue) {
      throw new Error(`Queue ${options.queue} does not exist`)
    }

    const job = new Job({
      id: jobId,
      args: options.args || {},
      queue: options.queue,
      status: 'pending',
    })

    this.jobs.set(jobId, job)

    queue
      .push(jobId)
      .then(() => (job.status = 'done'))
      .catch((err) => {
        job.status = 'failed'
        job.error = {
          message: err.message,
          errors: err.messages,
        }
      })

    return jobId
  }
}

export const Queue = new QueueService()

export default Queue
