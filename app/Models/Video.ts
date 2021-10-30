import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public visibilityId: number

  @column()
  public sourceId: string | null

  @column()
  public source: string

  @column()
  public slug: string

  @column()
  public src: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public publishedAt: DateTime

  @column()
  public raw: Record<string, any>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
