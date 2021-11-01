import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sourceId: string | null

  @column()
  public source: string

  @column()
  public parentId: number | null

  @column()
  public videoId: number

  @column()
  public avatarSrc: string

  @column()
  public username: string

  @column()
  public content: string

  @column()
  public publishedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
