import { Queue } from 'App/Queue'

export default class JobListener {
  public async index() {
    const jobs = Array.from(Queue.jobs.values())

    return {
      meta: {
        total: jobs.length,
      },
      data: jobs,
    }
  }

  public show(id: string) {
    const job = Queue.jobs.get(id)

    return job || null
  }

  public destroy(id: string) {
    const job = Queue.jobs.get(id)

    if (!job) {
      throw new Error('Job not found')
    }

    if (job.status === 'active') {
      throw new Error('Cannot delete active jobs')
    }

    Queue.jobs.delete(id)
  }
}
