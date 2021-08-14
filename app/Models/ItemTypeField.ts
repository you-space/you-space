import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

interface OptionInput {
  editable: boolean
  type: string
}
interface Options {
  type?: 'editable'
  label: string
  mapValue: string
  input: OptionInput
}

export default class ItemTypeField extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public typeId: number

  @column()
  public name: string

  @column()
  public options: Partial<Options>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
