import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum DefaultVisibilities {
  public = 'public',
  private = 'private',
}

export default class Visibility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: keyof typeof DefaultVisibilities

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
