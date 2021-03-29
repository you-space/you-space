import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  HasMany,
  hasMany,
  beforeFetch,
  ModelQueryBuilderContract,
  afterFetch,
  beforeFind,
  afterFind,
} from '@ioc:Adonis/Lucid/Orm'
import originProvider from 'App/Services/Origin/OriginProvider'
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

  @beforeFind()
  public static beforeFind(query: ModelQueryBuilderContract<typeof Video>) {
    query
      .preload('origin')
      .preload('visibility')
      .withCount('views', (query) => {
        query.sum('count').as('totalViews')
      })
  }

  @beforeFetch()
  public static beforeFetch(query: ModelQueryBuilderContract<typeof Video>) {
    query
      .preload('origin')
      .preload('visibility')
      .withCount('views', (query) => {
        query.sum('count').as('totalViews')
      })
  }

  @afterFetch()
  public static afterFetch(videos: Video[]) {
    return videos.map((v) => ({
      ...originProvider.serializeVideo(v.origin, v),
      totalViews: Number(v.$extras.totalViews) || 0,
    }))
  }

  @afterFind()
  public static afterFind(video: Video) {
    return {
      ...originProvider.serializeVideo(video.origin, video),
      totalViews: Number(video.$extras.totalViews) || 0,
    }
  }

  public serialize() {
    return {
      ...originProvider.serializeVideo(this.origin, this),
      ...super.serialize(),
      totalViews: Number(this.$extras.totalViews) || 0,
    }
  }
}
