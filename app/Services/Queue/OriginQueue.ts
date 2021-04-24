import OriginService from '@ioc:Providers/OriginService'
import Origin from 'App/Models/Origin'
import Bull, { Queue, Job } from 'bull'
import Logger from '@ioc:Adonis/Core/Logger'
interface ImportJobData {
  originId: number
  page: number
}

export default class OriginQueue {
  public queue: Queue
  constructor() {
    this.queue = new Bull('origins')

    this.queue.empty().then(() => {
      this.queue.process('import', this.processImport)
    })
  }

  public async processImport(job: Job<ImportJobData>) {
    const origin = await Origin.findOrFail(job.data.originId)

    await OriginService.importVideos(origin, job.data.page)
    Logger.child({
      page: job.data.page,
    }).info(`queue: import videos page ${job.data.page}`)

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
