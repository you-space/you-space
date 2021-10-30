import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'

function serializeSrc({ source, src, id }: Image) {
  if (source === 'local') {
    return [Env.get('APP_URL'), 'api', 'v1', 'images', 'embed', id].join('/')
  }

  return src
}
export default class Image extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    serialize: (_v, _, image: Image) => serializeSrc(image),
  })
  public src: string

  @column()
  public source: string

  @column()
  public alt: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteFile(image: Image) {
    if (image.source === 'local') {
      await Drive.delete(image.src)
    }
  }
}
