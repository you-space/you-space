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
import Visibility from './Visibility'

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
  public visibilityId: number

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

  @belongsTo(() => Visibility)
  public visibility: BelongsTo<typeof Visibility>

  public static havePermissions = scope(
    (query: ModelQueryBuilderContract<typeof Video>, permissions: string[]) => {
      query.whereHas('visibility', (q) =>
        q.whereHas('permissions', (q) => q.whereIn('name', permissions)).orWhere('name', 'public')
      )
    }
  )

  @beforeDelete()
  public static async deleteFile(video: Video) {
    if (video.source === 'local') {
      await Drive.delete(video.src)
    }
  }
}
