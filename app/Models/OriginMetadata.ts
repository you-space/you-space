import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class OriginMetadata extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'origin_id' })
  public originId: number

  @column({ columnName: 'total_videos', serializeAs: 'totalVideos' })
  public totalVideos: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
