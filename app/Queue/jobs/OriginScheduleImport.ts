import { QueueHandler } from '../index'

interface Data {
  originId: number
}

const job: QueueHandler<Data> = {
  key: 'origin-schedule-import',
  async handler(job, done) {
    const Origin = (await import('App/Models/Origin')).default

    const origin = await Origin.findOrFail(job.data.originId)

    const provider = await origin.findProvider()

    if (!provider.import) {
      return done(new Error('provider import method not found'))
    }

    await provider.import()

    done()
  },
}

export default job
