import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm'
import Origin from './Origin'
import Visibility from './Visibility'
import ItemMeta from './ItemMeta'
import Entity from './Entity'
import ContentProvider from './ContentProvider'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public contentProviderId: number

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

  @belongsTo(() => ContentProvider, {
    serializeAs: null,
  })
  public provider: BelongsTo<typeof ContentProvider>

  @belongsTo(() => Entity)
  public entity: BelongsTo<typeof Entity>

  @belongsTo(() => Visibility)
  public visibility: BelongsTo<typeof Visibility>

  @hasMany(() => Item, {
    localKey: 'id',
    foreignKey: 'parentId',
  })
  public child: HasMany<typeof Item>

  @hasMany(() => ItemMeta)
  public metas: HasMany<typeof ItemMeta>

  @beforeDelete()
  public static async beforeDelete(item: Item) {
    await item.related('child').query().delete()
    const metas = await item.related('metas').query()

    await Promise.all(metas.map(async (m) => await m.delete()))
  }
}
