import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class View extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'video_id' })
  public videoId: string

  @column({ columnName: 'origin_id' })
  public originId: number

  @column()
  public count: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
