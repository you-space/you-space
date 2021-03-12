import { BaseModel, belongsTo, BelongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Origin from './Origin'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'video_id' })
  public videoId: string

  @column({ columnName: 'origin_id' })
  public originId: number

  @column()
  public name: string

  @column()
  public src: string

  @column({ columnName: 'thumbnail_src', serializeAs: 'thumbnailSrc' })
  public thumbnailSrc: string

  @column({ columnName: 'origin_data' })
  public originData: object

  @belongsTo(() => Origin, {
    foreignKey: 'originId',
  })
  public origin: BelongsTo<typeof Origin>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
