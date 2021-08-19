import {
  BaseModel,
  beforeDelete,
  BelongsTo,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import File from './File'

export default class ItemFile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public itemId: number

  @column()
  public fileId: number

  @computed()
  public get url() {
    return `${Env.get('APP_URL')}/api/v1/files/${this.fileId}`
  }

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @beforeDelete()
  public static async beforeDelete(itemFile: ItemFile) {
    const file = await itemFile.related('file').query().first()

    if (file) {
      file.delete()
    }
  }
}
