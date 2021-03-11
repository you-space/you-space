import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Origin from './Origin'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'video_id' })
  public videoId: string

  @column({ columnName: 'origin_id' })
  public originId: number

  @column({ columnName: 'origin_data' })
  public originData: object

  @hasOne(() => Origin)
  public origin: HasOne<typeof Origin>
}
