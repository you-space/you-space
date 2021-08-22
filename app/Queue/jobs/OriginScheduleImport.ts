import { ProcessCallbackFunction } from 'bull'

interface Data {
  originId: number
}

const handler: ProcessCallbackFunction<Data> = async (job, done) => {
  const Logger = (await import('@ioc:Adonis/Core/Logger')).default

  const Origin = (await import('App/Models/Origin')).default

  const origin = await Origin.findOrFail(job.data.originId)

  const provider = await origin.findProvider()

  if (!provider.import) {
    return done(new Error('provider import method not found'))
  }

  Logger.info('import data from origin: %s', origin.name)

  await job.log(`importing ${new Date()}`)

  // await provider.import()

  done()
}

export default handler
