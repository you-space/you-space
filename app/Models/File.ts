import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, computed } from '@ioc:Adonis/Lucid/Orm'
import fs from 'fs'
import { promisify } from 'util'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Content from 'App/Services/ContentService'

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
    return Content.makePath('uploads', this.filename)
  }

  @beforeDelete()
  public static async beforeDelete(file: File) {
    await file.deleteFile()
  }

  public async deleteFile() {
    const filePath = Content.makePath('uploads', this.filename)
    const exist = await promisify(fs.exists)(filePath)
    if (exist) {
      await promisify(fs.unlink)(filePath)
    }
  }

  public static async upload(file: MultipartFileContract) {
    const uploadFolders = Content.makePath('uploads')
    const filename = `${cuid()}.${file.extname}`

    file.move(uploadFolders, {
      name: filename,
    })

    return File.create({
      extname: file.extname,
      filename: filename,
      type: file.type,
    })
  }
}
