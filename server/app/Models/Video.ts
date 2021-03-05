import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import VideoVisualization from './VideoVisualization'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public filename: string

  @column({
    columnName: 'filename_thumbnail',
  })
  public filenameThumbnail?: string

  @column()
  public extname: string

  @hasOne(() => VideoVisualization, {
    foreignKey: 'video_id',
  })
  public visualizations: HasOne<typeof VideoVisualization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
