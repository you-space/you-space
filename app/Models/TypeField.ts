import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum TypeFieldTypes {
  Mapped = 'mapped',
  Editable = 'editable',
  File = 'file',
}

interface Options {
  [prop: string]: any
  path?: string
}

export default class TypeField extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public typeId: number

  @column()
  public name: string

  @column()
  public type: TypeFieldTypes

  @column()
  public options: Options

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
