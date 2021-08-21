import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'
import SystemMeta from './SystemMeta'
import { isJson, requireIfExist } from 'App/Services/Helpers'
import Application from '@ioc:Adonis/Core/Application'
import ProviderService from 'App/Services/ProviderService'

export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: 'providerName' })
  public providerName: string

  @column()
  public active: boolean

  @column()
  public config: Record<string, string>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @hasMany(() => Item, {
    foreignKey: 'originId',
  })
  public Item: HasMany<typeof Item>

  public async findProvider() {
    const meta = await SystemMeta.findMetaObject(`plugins:*:providers:${this.providerName}`)

    const ProviderClass = await requireIfExist(
      Application.makePath('content', 'plugins', meta?.path)
    )

    if (!ProviderClass) {
      return null
    }

    const instance = new ProviderClass()

    instance.config = this.config
    instance.service = new ProviderService(this)

    return instance
  }

  public static async fetchProviders(checkIfIsValid = false) {
    const metas = await SystemMeta.fetchByName('plugins:*:providers:*')

    const providers = metas.map((meta) => {
      const value = isJson(meta.value) ? JSON.parse(meta.value) : {}

      value.name = meta.name.split(':').pop()

      if (checkIfIsValid) {
        value.valid = !!requireIfExist(Application.makePath('content', 'plugins', value.path))
      }

      return value
    })

    return providers
  }
}
