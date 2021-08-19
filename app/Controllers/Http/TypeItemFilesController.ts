import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import File from 'App/Models/File'

import Type from 'App/Models/Type'
import { TypeFieldTypes } from 'App/Models/TypeField'

export default class TypeItemFilesController {
  public async store({ request, params }: HttpContextContract) {
    const type = await Type.query()
      .preload('fields', (q) => q.where('type', TypeFieldTypes.File))
      .where('id', params.type_id)
      .withScopes((s) => s.isNotDeleted())
      .firstOrFail()

    const item = await type
      .related('items')
      .query()
      .preload('itemFiles')
      .where('id', params.item_id)
      .firstOrFail()

    const itemSchema = type.fields.reduce(
      (all, field) => ({
        ...all,
        [field.name]: schema.file(),
      }),
      {}
    )

    const payload = await request.validate({
      schema: schema.create(itemSchema),
    })

    Object.keys(payload).map(async (p) => {
      const old = await item.related('itemFiles').query().where('name', p).first()

      if (old) {
        await old.delete()
      }

      const file = await File.upload(payload[p])

      await item.related('itemFiles').create({
        fileId: file.id,
        name: p,
      })
    })

    return {
      message: 'files updated',
    }
  }
}
