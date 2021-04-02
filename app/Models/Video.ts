import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Comment from './Comment'
import Origin from './Origin'
import View from './View'
import Visibility from './Visibility'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'video_id', serializeAs: 'videoId' })
  public videoId: string

  @column({ columnName: 'origin_id' })
  public originId: number

  @column({ columnName: 'visibility_id', serializeAs: null })
  public visibilityId: number

  @column({ columnName: 'origin_data', serializeAs: null })
  public originData: object

  @belongsTo(() => Origin, {
    foreignKey: 'originId',
  })
  public origin: BelongsTo<typeof Origin>

  @belongsTo(() => Visibility)
  public visibility: BelongsTo<typeof Visibility>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => View, {
    foreignKey: 'videoId',
  })
  public views: HasMany<typeof View>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
