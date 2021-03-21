import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'

export enum DefaultVisibilities {
  public = 'public',
  private = 'private',
}

export default class Visibility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: keyof typeof DefaultVisibilities

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
