import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, computed } from '@ioc:Adonis/Lucid/Orm'
import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public filename: string

  @column()
  public type: string

  @column()
  public extname: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed({ serializeAs: null })
  public get filepath() {
    return Application.makePath('content', 'uploads', this.filename)
  }

  @beforeDelete()
  public static async deleteFile(file: File) {
    const filePath = Application.makePath('content', 'uploads', file.filename)
    const exist = await promisify(fs.exists)(filePath)
    if (exist) {
      await promisify(fs.unlink)(filePath)
    }
  }

  public static async upload(file: MultipartFileContract) {
    const uploadFolders = Application.makePath('content', 'uploads')
    const filename = `${cuid()}.${file.extname}`

    await file.move(uploadFolders, {
      name: filename,
    })

    return this.create({
      extname: file.extname,
      filename: filename,
      type: file.type,
    })
  }
}
