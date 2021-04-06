import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo, beforeDelete } from '@ioc:Adonis/Lucid/Orm'
import File from './File'

export default class VideoMetadata extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'video_id' })
  public videoId: string

  @column()
  public title: string | null

  @column()
  public description: string | null

  @column({ columnName: 'thumbnail_file_id' })
  public thumbnailFileId: number | null

  @column({ columnName: 'video_file_id' })
  public videoFileId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => File, {
    foreignKey: 'thumbnailFileId',
  })
  public thumbnailFile: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'videoFileId',
  })
  public videoFile: BelongsTo<typeof File>

  @beforeDelete()
  public static async deleteMetadata(metadata: VideoMetadata) {
    if (metadata.thumbnailFileId) {
      const file = await File.findOrFail(metadata.thumbnailFileId)

      await metadata.related('thumbnailFile').dissociate()

      await file.delete()
    }

    if (metadata.videoFileId) {
      const file = await File.findOrFail(metadata.videoFileId)

      await metadata.related('videoFile').dissociate()

      await file.delete()
    }
  }
}
