import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import VideoImage from './VideoImage'
import Image from './Image'

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

  @hasMany(() => VideoImage)
  public videoImages: HasMany<typeof VideoImage>

  @hasManyThrough([() => Image, () => VideoImage], {
    foreignKey: 'videoId',
    throughLocalKey: 'imageId',
    throughForeignKey: 'id',
  })
  public images: HasManyThrough<typeof Image>

  @beforeDelete()
  public static async deleteFile(video: Video) {
    if (video.source === 'local') {
      await Drive.delete(video.src)
    }
  }
}
