import lodash from 'lodash'
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Visibility from './Visibility'
import ItemField from './ItemField'
import TypeField from './TypeField'
import Origin from './Origin'
import TypeFieldField from './TypeField'
import Type from './Type'

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

  @belongsTo(() => TypeField, {
    foreignKey: 'typeId',
  })
  public type: BelongsTo<typeof TypeField>

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

  @hasMany(() => ItemField)
  public fields: HasMany<typeof ItemField>

  public serializeByType(type: Type) {
    const typeFields: TypeFieldField[] = lodash.get(type, 'fields', [])

    const item: any = {
      id: this.id,
      sourceId: this.sourceId,

      typeId: type.id,
      typeName: type.name,

      visibilityId: this.visibilityId,
      visibilityName: this.visibility?.name,
    }

    typeFields.forEach(({ name, options }) => {
      item[name] = lodash.get(this.value, options?.mapValue || '', this.value[name])
    })

    return item
  }
}
