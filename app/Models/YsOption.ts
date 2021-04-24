import { DateTime } from 'luxon'
import {
  afterFetch,
  afterFind,
  BaseModel,
  beforeCreate,
  beforeSave,
  beforeUpdate,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { isJson } from 'App/Services/Helpers'

export enum BaseOptions {
  CurrentTheme = 'current-theme',
  ActivatedPlugins = 'activated-plugins',
  ContentProviders = 'content-providers',
}
export default class YsOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public value: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  @beforeSave()
  @beforeUpdate()
  public static convertToJson(option: YsOption) {
    if (typeof option.value === 'object') {
      option.value = JSON.stringify(option.value)
    }

    if (Array.isArray(option.value)) {
      option.value = JSON.stringify(option.value)
    }
  }

  @afterFind()
  public static convertOptionValue(option: YsOption) {
    if (isJson(option.value)) {
      option.value = JSON.parse(option.value)
    }
  }

  @afterFetch()
  public static convertOptionsValues(options: YsOption[]) {
    options.forEach((option) => {
      if (isJson(option.value)) {
        option.value = JSON.parse(option.value)
      }
    })
  }
}
