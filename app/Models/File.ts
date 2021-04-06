import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'
import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'

export enum FileTypes {
  Image = 'image',
  Video = 'video',
  Other = 'other',
}

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public filename: string

  @column()
  public type: FileTypes

  @column()
  public extname: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteFile(file: File) {
    const filePath = Application.tmpPath('uploads', file.filename)
    const exist = await promisify(fs.exists)(filePath)
    console.log(filePath, exist)
    if (exist) {
      await promisify(fs.unlink)(filePath)
    }
  }
}
