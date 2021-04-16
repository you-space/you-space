import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  HasOne,
  hasOne,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm'
import Origin from './Origin'
import Visibility from './Visibility'
import EntityItemMeta from './EntityItemMeta'

export default class EntityItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public originId: number

  @column()
  public entityId: number

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

  @belongsTo(() => Origin)
  public origin: BelongsTo<typeof Origin>

  @belongsTo(() => Visibility)
  public visibility: BelongsTo<typeof Visibility>

  @hasMany(() => EntityItem, {
    localKey: 'id',
    foreignKey: 'parentId',
  })
  public child: HasMany<typeof EntityItem>

  @hasMany(() => EntityItemMeta)
  public metas: HasMany<typeof EntityItemMeta>

  @beforeDelete()
  public static async beforeDelete(item: EntityItem) {
    await item.related('child').query().delete()
    await item.related('view').query().delete()
    const metas = await item.related('metas').query()

    await Promise.all(metas.map(async (m) => await m.delete()))
  }
}
