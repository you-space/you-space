import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  HasMany,
  HasOne,
  hasMany,
  hasOne,
  computed,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import VideoMetadata from './VideoMetadata'
import Comment from './Comment'
import Origin from './Origin'
import View from './View'
import Visibility from './Visibility'
import OriginMain from '@ioc:Providers/OriginMainProvider'
import File from './File'

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
  public originData: any

  @computed()
  public get title() {
    if (!this.metadata || !this.metadata.title) {
      return null
    }

    return this.metadata.title
  }

  @computed()
  public get description() {
    if (!this.metadata || !this.metadata.description) {
      return null
    }

    return this.metadata.description
  }

  @computed()
  public get src() {
    if (!this.metadata || !this.metadata.videoFileId) {
      return null
    }

    return `api/v1/files/embed/${this.metadata.videoFileId}`
  }

  @computed()
  public get thumbnailSrc() {
    if (!this.metadata || !this.metadata.thumbnailFileId) {
      return null
    }

    return `api/v1/files/embed/${this.metadata.thumbnailFileId}`
  }

  @hasOne(() => VideoMetadata)
  public metadata: HasOne<typeof VideoMetadata>

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

  @beforeDelete()
  public static async deleteMetadata(video: Video) {
    const metadata = await video.related('metadata').query().first()

    await video.related('views').query().delete()

    if (metadata) {
      await metadata.delete()
    }

    if (video.originId === OriginMain.id) {
      const file = await File.findOrFail(video.videoId)
      if (file) {
        await file.delete()
      }
    }
  }
}
