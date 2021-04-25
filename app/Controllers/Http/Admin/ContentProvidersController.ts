import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin from 'App/Models/Origin'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import { schema } from '@ioc:Adonis/Core/Validator'
import ContentProvider from 'App/Models/ContentProvider'
import Entity from 'App/Models/Entity'

interface Provider {
  name: string
  path: string
}

export default class ContentProvidersController {
  private async getValidProvider(providerName: string) {
    const option = await YsOption.findByOrFail('name', BaseOptions.RegisteredContentProviders)

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

  public async index({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)

    const providers = await origin.related('providers').query()

    return await Promise.all(
      providers.map(async (p) => {
        const data = {
          id: p.id,
          originId: p.originId,
          name: p.name,
          valid: false,
          fields: [],
          options: [],
          active: p.active,
          entityName: 'unknown',
          config: p.config,
        }

        const provider = await this.getValidProvider(p.name)

        if (provider) {
          const providerPath = Application.makePath('content', 'plugins', provider.path)
          const instance = (await import(providerPath)).default

          data.valid = true

          if (instance.fields) {
            data.fields = instance.fields
          }

          if (instance.options) {
            data.options = instance.options
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

    await origin.related('providers').updateOrCreate({ name }, { name })
  }

  public async update({ request, params }: HttpContextContract) {
    const provider = await ContentProvider.findOrFail(params.id)

    const { config, active } = await request.validate({
      schema: schema.create({
        config: schema.object.optional().anyMembers(),
        active: schema.boolean.optional(),
      }),
    })

    const isValid = await this.getValidProvider(provider.name)

    if (!isValid) {
      throw new Error('Provider was not found or was deleted')
    }

    if (config) {
      provider.config = config
    }

    if (typeof active === 'boolean') {
      provider.active = active
    }

    await provider.save()
  }

  public async destroy({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)

    const provider = await origin.related('providers').query().where('id', params.id).firstOrFail()

    await provider.delete()
  }

  public async import({ params }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.origin_id)

    const contentProvider = await origin
      .related('providers')
      .query()
      .where('id', params.id)
      .firstOrFail()

    const validProvider = await this.getValidProvider(contentProvider.name)

    if (!validProvider) {
      throw new Error('erro getting provider')
    }

    const providerPath = Application.makePath('content', 'plugins', validProvider.path)

    const Provider = (await import(providerPath)).default

    const instance = new Provider()

    instance.config = contentProvider.config

    instance.service = {
      createMany: async (data) => {
        const entity = await Entity.firstOrCreate({
          name: Provider.entityName || 'unknown',
        })

        await contentProvider.related('items').updateOrCreateMany(
          data.map((i) => ({
            sourceId: i.id,
            value: i.data,
            entityId: entity.id,
          })),
          ['entityId', 'sourceId']
        )
      },
    }

    await instance.import()

    return {
      status: 200,
      message: 'data of provider imported',
    }
  }
}
