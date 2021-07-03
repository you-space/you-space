import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Env from '@ioc:Adonis/Core/Env'

export default class ItemField extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public itemId: number

  @column()
  public name: string

  @column()
  public type: string

  @column({
    serialize: (value, _, model: ItemField) => {
      if (model.type === 'file') {
        return `${Env.get('DOMAIN_URL')}/api/v1/files/${value}`
      }

      return value
    },
  })
  public value: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteFile(field: ItemField) {
    if (field.type !== 'file') {
      return
    }

    const file = await File.find(field.value)

    if (!file) {
      return
    }

    await file.delete()
  }
}
