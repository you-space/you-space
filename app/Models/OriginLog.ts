import { DateTime } from 'luxon'
import { afterDelete, afterSave, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum OriginLogTypes {
  Error = 'error',
  Info = 'info',
}

export default class OriginLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'origin_id' })
  public originId: number

  @column()
  public type: OriginLogTypes

  @column()
  public message: string

  @column()
  public payload: any

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @afterSave()
  public static async emitSaveEvent() {
    const SocketService = (await import('@ioc:Providers/SocketService')).default
    SocketService.io.of('/admin').emit('originLog:created')
  }

  @afterDelete()
  public static async emitDeleteEvent() {
    const SocketService = (await import('@ioc:Providers/SocketService')).default
    SocketService.io.of('/admin').emit('originLog:deleted')
  }
}
