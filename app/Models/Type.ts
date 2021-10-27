import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  afterDelete,
  beforeSave,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Drive from '@ioc:Adonis/Core/Drive'

import Item from './Item'
import { kebabCase } from 'lodash'
import { requireIfExist } from 'App/Helpers'
import Content from 'App/Services/ContentService'

export interface TypeOptions {
  label?: string
  icon?: string
  showInMenu?: boolean
}
interface Schema {
  type: 'string' | 'number'
  required?: boolean
  map?: string
  serialize?: (raw: any) => any
}

export type TypeSchema = Record<string, Schema>

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public options: TypeOptions

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  public get schemaFilename() {
    return Content.makePath('schemas', `${this.id}.js`)
  }

  @hasMany(() => Item, {
    foreignKey: 'typeId',
  })
  public items: HasMany<typeof Item>

  @beforeSave()
  public static beforeSave(type: Type) {
    type.name = kebabCase(type.name)
  }

  @afterDelete()
  public static async afterDelete(type: Type) {
    await Drive.delete(type.schemaFilename)
  }

  public static idOrName = scope((query) => {
    query.where('publishedOn', '<=', DateTime.utc().toSQLDate())
  })

  public static fetchByIdOrName(idOrName: string) {
    return Type.query()
      .whereIn(
        'id',
        String(idOrName)
          .split(',')
          .filter((id) => !isNaN(Number(id)))
      )
      .orWhereIn(
        'name',
        String(idOrName)
          .split(',')
          .filter((name) => isNaN(Number(name)))
      )
  }

  public static findSchemaById(id: string | number) {
    const filename = Content.makePath('schemas', `${id}.js`)

    const schema = requireIfExist(filename)

    return schema as TypeSchema | null
  }

  public findSchema() {
    return Type.findSchemaById(this.id)
  }
}
