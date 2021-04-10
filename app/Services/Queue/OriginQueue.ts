import OriginService from '@ioc:Providers/OriginService'
import Origin from 'App/Models/Origin'
import OriginLog, { OriginLogTypes } from 'App/Models/OriginLog'
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
    this.queue.process('import', this.processImport)
    this.queue.process('delete-old-logs', this.deleteOldLogs)

    this.queue.add(
      'delete-old-logs',
      {},
      {
        repeat: {
          cron: '0 * * * *',
        },
      }
    )
  }

  public async deleteOldLogs() {
    const lastOurMilliseconds = Date.now() - 60 * 60 * 1000

    const oldLogs = await OriginLog.query().where('created_at', '<=', new Date(lastOurMilliseconds))

    Logger.child({
      length: oldLogs.length,
    }).info('cleaning old origin logs')

    return await Promise.all(oldLogs.map(async (l) => await l.delete()))
  }

  public async processImport(job: Job<ImportJobData>) {
    const origin = await Origin.findOrFail(job.data.originId)

    await OriginService.registerVideos(origin, job.data.page)

    await origin.related('logs').create({
      message: `queue: import videos page ${job.data.page}`,
      type: OriginLogTypes.Info,
      payload: {
        page: job.data.page,
      },
    })

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
