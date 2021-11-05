import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'

import Image from './Image'
import View from './View'
import Comment from './Comment'
import Permission from './Permission'

function serializeSrc({ source, src, id }: Video) {
  if (source === 'local') {
    return [Env.get('APP_URL'), 'api', 'v1', 'videos', 'embed', id].join('/')
  }

  return src
}

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public permissionId: number

  @column()
  public sourceId: string | null

  @column()
  public source: string

  @column()
  public slug: string

  @column({
    serialize: (_v, _, video: Video) => serializeSrc(video),
  })
  public src: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public publishedAt: DateTime

  @column()
  public raw: Record<string, any>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasMany(() => View)
  public views: HasMany<typeof View>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @belongsTo(() => Permission)
  public permission: BelongsTo<typeof Permission>

  public static isVisibleTo = scope(
    (query: ModelQueryBuilderContract<typeof Video>, permission: string[]) => {
      query.whereHas('permission', (q) => q.whereIn('name', permission))
    }
  )

  @beforeDelete()
  public static async deleteFile(video: Video) {
    if (video.source !== 'local') {
      return
    }

    const exists = await Drive.exists(video.src)

    if (!exists) {
      return
    }

    await Drive.delete(video.src)
  }
}
