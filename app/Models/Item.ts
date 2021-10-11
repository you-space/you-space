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
} from '@ioc:Adonis/Lucid/Orm'

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
  public originId: number

  @column()
  public typeId: number

  @column()
  public visibilityId: number

  @column()
  public parentId: number

  @column()
  public sourceId: string

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

  public serializeByTypeSchema() {
    const item: any = {
      id: this.id,
      source_id: this.sourceId,
      parent_id: this.parentId,
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

      item[key] = this.value[key]
    })

    item.type = this.type
    item.visibility = this.visibility

    return item
  }
}
