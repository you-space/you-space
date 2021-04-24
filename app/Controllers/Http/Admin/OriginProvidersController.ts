import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin from 'App/Models/Origin'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import { schema } from '@ioc:Adonis/Core/Validator'
import lodash from 'lodash'

interface Provider {
  name: string
  path: string
}

export default class OriginProvidersController {
  private async getValidProvider(providerName: string) {
    const option = await YsOption.findByOrFail('name', BaseOptions.ContentProviders)

    const allProviders = option.value as Provider[]

    const provider = allProviders.find((p) => p.name === providerName)

    if (!provider) {
      return null
    }

    const providerPath = Application.makePath('content', 'plugins', provider.path)

    const exists = await promisify(fs.exists)(providerPath)

    if (!exists) {
      return null
    }

    return provider
  }

  private async getActiveProvidersMeta(origin: Origin) {
    const meta = await origin.related('metas').firstOrCreate(
      { name: 'active-providers' },
      {
        name: 'active-providers',
        value: [],
      }
    )

    return meta
  }

  public async index({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)
    const activeProviderMeta = await this.getActiveProvidersMeta(origin)
    const activeProviders = activeProviderMeta.value as string[]

    const originProviders = await origin
      .related('metas')
      .query()
      .where('name', 'like', 'provider:%')
      .orderBy('created_at')

    return await Promise.all(
      originProviders.map(async ({ name, value }) => {
        const providerName = name.replace('provider:', '')

        const data = {
          name: providerName,
          valid: false,
          fields: [],
          active: activeProviders.includes(providerName),
          entityName: 'unknown',
          config: value || {},
        }

        const provider = await this.getValidProvider(providerName)

        if (provider) {
          const providerPath = Application.makePath('content', 'plugins', provider.path)
          const instance = (await import(providerPath)).default

          data.valid = true

          if (instance.fields) {
            data.fields = instance.fields
          }

          if (instance.entityName) {
            data.entityName = instance.entityName
          }
        }

        return data
      })
    )
  }

  public async store({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const provider = await this.getValidProvider(name)

    if (!provider) {
      throw new Error('Provider was not found or was deleted')
    }

    const metaName = `provider:${name}:config`

    await origin.related('metas').firstOrCreate({
      name: metaName,
      value: {},
    })
  }

  public async update({ request, params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)
    const providerName = params.id

    const { config, active } = await request.validate({
      schema: schema.create({
        config: schema.object.optional().anyMembers(),
        active: schema.boolean.optional(),
      }),
    })

    const provider = await this.getValidProvider(providerName)

    if (!provider) {
      throw new Error('Provider was not found or was deleted')
    }

    const activeProviderMeta = await this.getActiveProvidersMeta(origin)
    const actives = activeProviderMeta.value as string[]

    if (active === true) {
      actives.push(providerName)
      activeProviderMeta.value = lodash.uniq(actives)
      await activeProviderMeta.save()
    }

    if (active === false) {
      activeProviderMeta.value = actives.filter((p: string) => p !== providerName)
      await activeProviderMeta.save()
    }

    if (config) {
      const metaName = `provider:${providerName}`
      await origin.related('metas').updateOrCreate(
        { name: metaName },
        {
          name: metaName,
          value: config,
        }
      )
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)

    const providerName = params.id

    const metaName = `provider:${providerName}`

    const meta = await origin.related('metas').query().where('name', metaName).firstOrFail()

    await meta.delete()
  }
}
