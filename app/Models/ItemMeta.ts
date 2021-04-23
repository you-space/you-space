import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'
import File from './File'

export default class EntityItemMeta extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public entityItemId: number

  @column()
  public name: string

  @column()
  public value: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteFiles(meta: EntityItemMeta) {
    const fileNames = ['fileId', 'thumbnailId']
    if (!fileNames.includes(meta.name)) {
      return
    }

    const file = await File.find(meta.value)

    if (file) {
      await file.delete()
    }
  }
}
