import lodash from 'lodash'
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Visibility from './Visibility'
import TypeField from './TypeField'
import Origin from './Origin'
import Type from './Type'
import ItemMeta from './ItemMeta'

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

  public serializeByType(type: Type) {
    const item: any = {
      id: this.id,
      sourceId: this.sourceId,

      typeId: type.id,
      typeName: type.name,

      visibilityId: this.visibilityId,
      visibilityName: this.visibility?.name,
    }

    type.fields
      .filter((f) => f.type === 'mapped')
      .forEach(({ name, options }) => {
        item[name] = lodash.get(this.value, options?.path || '', this.value[name])
      })

    type.fields
      .filter((f) => f.type === 'editable')
      .forEach(({ name }) => {
        const meta = this.metas.find((m) => m.name === name)
        item[name] = lodash.get(meta, 'value', null)
      })

    return item
  }
}
