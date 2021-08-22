import Plugin from 'App/Extensions/Plugin'
import { importIfExist } from 'App/Services/Helpers'
import { ProcessCallbackFunction } from 'bull'

export interface PluginJobOptions {
  filename: string
  methodName: string
  pluginName?: string
  id?: string | number
  args?: any
}

const key = 'plugin'

const handler: ProcessCallbackFunction<PluginJobOptions> = async (job, done) => {
  const plugin = await Plugin.find(job.data.pluginName || '')

  const { filename, methodName, args } = job.data

  const Class = await importIfExist(filename)

  if (!plugin.valid && !plugin.active) {
    return done(new Error('plugin not found or is inactive'))
  }

  if (!Class) {
    return done(new Error('file not found'))
  }

  const instance = new Class()

  if (!instance[methodName]) {
    return done(new Error(`method ${methodName} not found`))
  }

  instance.plugin = plugin

  await instance[methodName](args)

  // const Logger = (await import('@ioc:Adonis/Core/Logger')).default

  // const Origin = (await import('App/Models/Origin')).default

  // const origin = await Origin.findOrFail(job.data.originId)

  // const provider = await origin.findProvider()

  // if (!provider.import) {
  //   return done(new Error('provider import method not found'))
  // }

  // Logger.info('import data from origin: %s', origin.name)

  // await job.log(`importing ${new Date()}`)

  // // await provider.import()

  done()
}

export default {
  key,
  handler,
}
