import OriginService from '@ioc:Providers/OriginService'
import Origin from 'App/Models/Origin'
import Bull, { Queue, Job } from 'bull'

interface ImportJobData {
  originId: number
  page: number
}

export default class OriginQueue {
  public queue: Queue
  constructor() {
    this.queue = new Bull('origins')
    this.queue.process('import', this.processImport)
  }

  public async processImport(job: Job<ImportJobData>) {
    const origin = await Origin.findOrFail(job.data.originId)

    OriginService.registerVideos(origin, job.data.page)

    return Promise.resolve()
  }

  public addVideoPageImport(originId: number, page: number, delay = 5) {
    this.queue.add(
      'import',
      {
        originId: originId,
        page,
      },
      { delay }
    )
  }
}
