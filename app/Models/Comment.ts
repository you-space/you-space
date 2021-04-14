import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  computed,
  belongsTo,
  BelongsTo,
  beforeSave,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public userId: string

  @column({ columnName: 'video_id' })
  public videoId: string

  @column({ columnName: 'origin_id' })
  public originId: number

  @column({ columnName: 'comment_id' })
  public commentId: string

  @column({ columnName: 'parent_comment_id' })
  public parentCommentId: string

  @column({ columnName: 'like_count' })
  public likeCount: number

  @column({ columnName: 'unlike_count' })
  public unlikeCount: number

  @column({ columnName: 'origin_like_count' })
  public originLikeCount: number

  @column({ columnName: 'origin_unlike_count' })
  public originUnlikeCount: number

  @column({ columnName: 'origin_data', serializeAs: null })
  public originData: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get totalLikeCount() {
    return this.likeCount + this.originLikeCount
  }

  @computed()
  public get totalUnlikeCount() {
    return this.unlikeCount + this.originUnlikeCount
  }

  @hasMany(() => Comment, {
    localKey: 'id',
    foreignKey: 'parentCommentId',
  })
  public replies: HasMany<typeof Comment>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @beforeSave()
  public static async createUserIfNotExist(comment: Comment) {
    await User.firstOrCreate({
      id: comment.userId,
      userId: comment.userId.replace(`${comment.originId}-`, ''),
      originId: comment.originId,
    })
  }
}
