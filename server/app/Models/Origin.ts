import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import OriginMetadata from './OriginMetadata'

export enum OriginTypes {
  YouTube = 'you-tube',
  Main = 'main',
}

export interface YoutubeConfig {
  apiToken: string
  channelId: string
  uploadPlaylistId: string
}

export type OriginConfig = YoutubeConfig | any

export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: OriginTypes

  @column({ serializeAs: null })
  public config: OriginConfig

  @hasMany(() => Video, {
    foreignKey: 'originId',
  })
  public videos: HasMany<typeof Video>

  @hasOne(() => OriginMetadata)
  public metadata: HasOne<typeof OriginMetadata>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
