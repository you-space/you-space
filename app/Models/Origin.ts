import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  column,
  computed,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import OriginMetadata from './OriginMetadata'
import View from './View'
import Comment from './Comment'
import User from './User'
import OriginLog from './OriginLog'

export enum OriginTypes {
  YouTube = 'you-tube',
  Main = 'main',
}

export interface YoutubeConfig {
  apiKey: string
  channelId: string
}

export type OriginConfig = YoutubeConfig

export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: OriginTypes | string

  @column()
  public config: OriginConfig

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @computed()
  public get isDefault() {
    return this.type === OriginTypes.Main
  }

  @hasOne(() => OriginMetadata)
  public metadata: HasOne<typeof OriginMetadata>

  @hasMany(() => User, {
    foreignKey: 'originId',
  })
  public users: HasMany<typeof User>

  @hasMany(() => Video, {
    foreignKey: 'originId',
  })
  public videos: HasMany<typeof Video>

  @hasMany(() => View, {
    foreignKey: 'originId',
  })
  public views: HasMany<typeof View>

  @hasMany(() => Comment, {
    foreignKey: 'originId',
  })
  public comments: HasMany<typeof Comment>

  @hasMany(() => OriginLog, {
    foreignKey: 'originId',
    onQuery: (query) => query.orderBy('created_at', 'desc'),
  })
  public logs: HasMany<typeof OriginLog>

  @beforeDelete()
  public static async beforeDelete(origin: Origin) {
    await origin.related('metadata').query().delete()

    await origin.related('comments').query().delete()
    await origin.related('views').query().delete()

    await origin.related('users').query().delete()
    await origin.related('videos').query().delete()

    await origin.related('logs').query().delete()
  }
}
