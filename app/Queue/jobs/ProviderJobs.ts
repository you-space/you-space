import { ProcessCallbackFunction } from 'bull'

interface Data {
  providerName: string
  methodName: string
  originId?: number
  data: any
}

export const key = 'providers:jobs'

const handler: ProcessCallbackFunction<Data> = async (job, done) => {
  const Origin = (await import('App/Models/Origin')).default
  const Provider = (await import('App/Extensions/Provider')).default

  const { providerName, methodName, data, originId } = job.data

  const provider = await Provider.findOrFail(providerName)

  job.progress(20)

  if (originId) {
    const origin = await Origin.findOrFail(originId)

    provider.useOrigin(origin)
  }

  job.progress(60)

  if (!provider.$instance[methodName]) {
    done(new Error(`${providerName} method not found`))
    return
  }

  await provider.$instance[methodName](data)

  job.progress(100)

  return done()
}

export default {
  key,
  handler,
}
