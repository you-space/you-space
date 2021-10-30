import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VideoImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public videoId: number

  @column()
  public imageId: number
}
