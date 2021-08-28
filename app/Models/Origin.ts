import lodash from 'lodash'
import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'
import Queue from '@ioc:Queue'
import OriginScheduleImport from 'App/Queue/jobs/OriginScheduleImport'
import Redis from '@ioc:Adonis/Addons/Redis'

export enum OriginScheduleOptions {
  None = 'none',
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Month = 'month',
  Week = 'week',
}
export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: 'providerName', serialize: (value) => value.split(':').pop() })
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

  public async findSchedule() {
    const key = `origins:import:schedule:${this.id}`

    const schedule = {
      repeatEach: (await Redis.get(`${key}:repeatEach`)) || 'none',
    }

    return schedule
  }

  public async updateSchedule(repeatEach: OriginScheduleOptions) {
    const key = `origins:import:schedule:${this.id}`

    const options = {
      minute: '* * * * *',
      hour: '0 * * * *',
      day: '0 0 * * *',
      month: '0 0 1 * *',
      week: '0 0 * * 0',
    }

    const queue = Queue.findOrFail(OriginScheduleImport.key)
    const lastJobKey = await Redis.get(key)

    if (lastJobKey) {
      await queue?.removeRepeatableByKey(lastJobKey)
      await Redis.del(key)
      await Redis.del(`${key}:repeatEach`)
    }

    if (options[repeatEach]) {
      const job = await queue.add(
        {
          originId: this.id,
        },
        {
          removeOnFail: true,
          repeat: {
            cron: options[repeatEach],
          },
        }
      )

      await Redis.set(key, lodash.get(job, 'opts.repeat.key', null))
      await Redis.set(`${key}:repeatEach`, repeatEach)
    }
  }
}
