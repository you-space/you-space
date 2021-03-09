import { DateTime } from 'luxon'
import {
  afterFind,
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  computed,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import VideoVisualization from './VideoVisualization'
import Image from './Image'

export default class Video extends BaseModel {
  @column({ isPrimary: true, serializeAs: 'videoId' })
  public id: number

  @column()
  public name: string

  @column()
  public filename: string

  @column({
    columnName: 'image_id',
  })
  public imageId?: number

  @column()
  public extname: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => VideoVisualization, {
    foreignKey: 'video_id',
  })
  public visualizations: HasMany<typeof VideoVisualization>

  @hasOne(() => Image, {
    localKey: 'imageId',
    foreignKey: 'id',
  })
  public thumbnail: HasOne<typeof Image>

  @computed()
  public get viewCount() {
    if (!this.visualizations) {
      return 0
    }
    return this.visualizations.reduce((count, v) => count + Number(v.count), 0)
  }

  @computed()
  public get originId() {
    return null
  }

  @computed()
  public get src() {
    return `${process.env.DOMAIN_URL}/v1/videos/${this.id}`
  }
  @computed()
  public get thumbSrc() {
    return `${process.env.DOMAIN_URL}/v1/thumbnails/${this.id}`
  }

  @beforeFetch()
  public static async addVisualizations(query: ModelQueryBuilderContract<typeof Video>) {
    query.preload('visualizations')
  }
}
