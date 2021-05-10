import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { promisify } from 'util'
import fs from 'fs'

import Origin from 'App/Models/Origin'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import OriginValidator from 'App/Validators/OriginValidator'
import OriginUpdateValidator from 'App/Validators/OriginUpdateValidator'

export default class OriginsController {
  public async index({ params }: HttpContextContract) {
    const { value } = await YsOption.findByOrFail('name', BaseOptions.RegisteredContentProviders)
    const providers = await Promise.all(
      value.map(async ({ path, name }) => {
        const providerPath = Application.makePath('content', 'plugins', path)
        const exist = await promisify(fs.exists)(providerPath)
        return {
          name,
          path,
          exist,
        }
      })
    )

    const origins = await Origin.query()

    return origins.map((o) => {
      const provider = providers.find((p) => p.name === o.providerName)
      return {
        ...o.serialize(),
        provider: provider || {},
      }
    })
  }

  public async store({ request }: HttpContextContract) {
    throw new Error('refactoring')
    // const { name } = await request.validate(OriginValidator)

    // return await Origin.create({
    //   name,
    // })
  }

  public async show({ params }: HttpContextContract) {
    throw new Error('refactoring')
    // return await Origin.query().where('id', params.id).firstOrFail()
  }

  public async update({ params, request }: HttpContextContract) {
    const origin = await Origin.findOrFail(params.id)

    const updateData = await request.validate(OriginUpdateValidator)

    console.log(updateData)

    Object.assign(origin, updateData)

    await origin.save()

    return {
      status: 200,
      message: 'Origin updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    throw new Error('refactoring')
    // const origin = await Origin.findOrFail(params.id)
    // await origin.delete()
  }
}
