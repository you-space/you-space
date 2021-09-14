import { ProcessCallbackFunction } from 'bull'
interface Data {
  originId: number
}

const handler: ProcessCallbackFunction<Data> = async (job, done) => {
  const Origin = (await import('App/Models/Origin')).default
  const Provider = (await import('App/Extensions/Provider')).default

  const origin = await Origin.findOrFail(job.data.originId)

  const provider = await Provider.findOrFail(origin.providerName)

  provider.useOrigin(origin)

  await provider
    .import()
    .catch((err) => done(err))
    .then(() => done())
}

export default {
  key: 'origins:import',
  handler,
}
