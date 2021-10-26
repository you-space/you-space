import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  hasManyThrough,
  HasManyThrough,
  scope,
} from '@ioc:Adonis/Lucid/Orm'

import lodash from 'lodash'

import Logger from '@ioc:Adonis/Core/Logger'

import Visibility from './Visibility'
import Origin from './Origin'
import Type from './Type'
import ItemMeta from './ItemMeta'
import ItemFile from './ItemFile'
import File from './File'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public originId = null as number | null

  @column()
  public typeId: number

  @column()
  public visibilityId: number

  @column()
  public parentId = null as number | null

  @column()
  public sourceId = null as string | null

  @column()
  public value: Record<string, unknown>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Type, {
    foreignKey: 'typeId',
  })
  public type: BelongsTo<typeof Type>

  @belongsTo(() => Origin, {
    foreignKey: 'originId',
  })
  public origin: BelongsTo<typeof Origin>

  @belongsTo(() => Visibility)
  public visibility: BelongsTo<typeof Visibility>

  @hasMany(() => Item, {
    localKey: 'id',
    foreignKey: 'parentId',
  })
  public child: HasMany<typeof Item>

  @hasMany(() => ItemMeta)
  public metas: HasMany<typeof ItemMeta>

  @hasMany(() => ItemFile)
  public itemFiles: HasMany<typeof ItemFile>

  @hasManyThrough([() => File, () => ItemFile], {
    throughForeignKey: 'id',
  })
  public files: HasManyThrough<typeof File>

  public static orderByValueProperty = scope((query, propertyMap: string, desc = false) => {
    const map = propertyMap
      .split('.')
      .map((key) => `'${key}'`)
      .join('->')

    query.orderByRaw(`value->${map} ${desc ? 'DESC' : 'ASC'}`)
  })

  public static whereValueProperty = scope((query, propertyMap: string, value: any) => {
    const map = lodash.set({}, propertyMap, value)

    query.whereRaw('value @> ?', [JSON.stringify(map)])
  })

  public serializeByTypeSchema() {
    const item: any = {
      id: this.id,
      source_id: this.sourceId,
      parent_id: this.parentId,
      type: this.type,
      visibility: this.visibility,
    }

    const schema = Type.findSchemaById(this.typeId)

    if (!schema) {
      Logger.error('[items] schema not found for type %i', this.typeId)
      return item
    }

    Object.entries(schema).forEach(([key, field]) => {
      if (field.serialize) {
        item[key] = field.serialize(this.value)
        return
      }

      item[key] = lodash.get(this.value, field.map || key)
    })

    return item
  }
}
