import { ProcessCallbackFunction } from 'bull'
interface Data {
  originId: number
}

const handler: ProcessCallbackFunction<Data> = async (job, done) => {
  const Origin = (await import('App/Models/Origin')).default
  const Provider = (await import('App/Extensions/Provider')).default

  const origin = await Origin.findOrFail(job.data.originId)

  console.log(origin.providerName)

  const provider = await Provider.findOrFail(origin.providerName)

  provider.useOrigin(origin)

  const setProgress = (percentage: number) => job.progress(percentage)

  await provider
    .import(setProgress)
    .catch((err) => done(err))
    .then(() => done())
}

export default {
  key: 'origins:import',
  handler,
}
