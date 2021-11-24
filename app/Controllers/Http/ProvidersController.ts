import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import ProviderRepository from 'App/Repositories/ProviderRepository'

export default class ProvidersController {
  constructor(public repository = ProviderRepository) {}

  public async index() {
    const providers = await this.repository.index()

    const data = providers.map((p) => p.serialize(['id', 'name', 'description', 'active']))

    return {
      data,
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const provider = await this.repository.show(params.id)

    if (!provider) {
      return response.notFound({
        message: 'Provider not found',
      })
    }

    await provider.loadFieldValues()
    await provider.loadImport()

    return provider.serialize(['id', 'name', 'description', 'import', 'active', 'fields'])
  }

  public async update({ response, request, params }: HttpContextContract) {
    const provider = await this.repository.show(params.id)

    if (!provider) {
      return response.notFound({
        message: 'Provider not found',
      })
    }

    const data = await request.validate({
      schema: schema.create({
        active: schema.boolean(),
        import: schema.enum.optional(['none', 'daily', 'weekly', 'monthly']),
        fields: schema.array.optional().members(
          schema.object().members({
            name: schema.enum(provider.fields.map((f) => f.name)),
            value: schema.string.optional(),
            encrypted: schema.boolean(),
          })
        ),
      }),
    })

    await provider.update({
      active: data.active,
      fields: data.fields || [],
      import: data.import as any,
    })

    return {
      message: 'Provider updated',
    }
  }
}
