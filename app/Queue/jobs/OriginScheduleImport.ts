import { ProcessCallbackFunction } from 'bull'
import Logger from '@ioc:Adonis/Core/Logger'
import Origin from 'App/Models/Origin'
import Provider from 'App/Extensions/Provider'
interface Data {
  originId: number
}

const handler: ProcessCallbackFunction<Data> = async (job, done) => {
  const origin = await Origin.findOrFail(job.data.originId)

  const provider = await Provider.findOrFail(origin.providerName)

  provider.useOrigin(origin)

  const setProgress = (percentage: number) => job.progress(percentage)

  await provider.import(setProgress)

  job.progress(100)

  done()
}

export default {
  key: 'origins:import',
  handler,
}
