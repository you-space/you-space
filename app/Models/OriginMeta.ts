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

export default class OriginMeta extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public originId: number

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
  public static convertToJson(meta: OriginMeta) {
    if (typeof meta.value === 'object') {
      meta.value = JSON.stringify(meta.value)
    }

    if (Array.isArray(meta.value)) {
      meta.value = JSON.stringify(meta.value)
    }
  }

  @afterFind()
  public static convertMetaValue(meta: OriginMeta) {
    console.log('here', meta)
    if (isJson(meta.value)) {
      meta.value = JSON.parse(meta.value)
    }
  }

  @afterFetch()
  public static convertMetasValues(metas: OriginMeta[]) {
    metas.forEach((meta) => {
      if (isJson(meta.value)) {
        meta.value = JSON.parse(meta.value)
      }
    })
  }
}
