import lodash from 'lodash'
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Visibility from './Visibility'
import ItemField from './ItemField'
import TypeField from './TypeField'
import Origin from './Origin'
import TypeFieldField from './TypeField'

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

  public serializeByType(type: TypeField) {
    const typeFields: TypeFieldField[] = lodash.get(type, 'fields', [])

    const itemFields = this.fields.reduce(
      (all, f) => ({
        ...all,
        [f.name]: f.serialize().value,
      }),
      {}
    )

    const mappedValues = typeFields.reduce(
      (all, f) => ({
        ...all,
        [f.name]: lodash.get(this.value, f.options?.mapValue || '', this.value[f.name]),
      }),
      {}
    )

    return {
      id: this.id,
      sourceId: this.sourceId,

      typeId: type.id,
      typeName: type.name,

      visibilityId: this.visibilityId,
      visibilityName: this.visibility?.name,

      ...mappedValues,
      ...itemFields,
    }
  }
}
