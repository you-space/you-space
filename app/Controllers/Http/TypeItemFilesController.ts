import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
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
        [field.name]: schema.file.optional(),
      }),
      {}
    )

    const payload = await request.validate({
      schema: schema.create(itemSchema),
    })

    const trx = await Database.transaction()

    item.useTransaction(trx)

    await Promise.all(
      type.fields
        .filter((f) => !!payload[f.name])
        .map(async (field) => {
          const old = await item
            .related('itemFiles')
            .query()
            .preload('file')
            .where('typeFieldId', field.id)
            .first()

          if (old && old.file) {
            await old.file.delete()
          }

          const file = await File.upload(payload[field.name])

          await item.related('itemFiles').create({
            fileId: file.id,
            typeFieldId: field.id,
          })
        })
    )

    await trx.commit()

    return {
      message: 'files updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
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

    const itemFile = await item
      .related('itemFiles')
      .query()
      .where('typeFieldId', params.id)
      .firstOrFail()

    await itemFile.delete()

    return {
      message: 'files deleted',
    }
  }
}
