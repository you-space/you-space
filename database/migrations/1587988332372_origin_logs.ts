import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OriginLogTypes } from 'App/Models/OriginLog'

export default class OriginLogs extends BaseSchema {
  protected tableName = 'origin_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('origin_id').references('origins.id').notNullable()

      table.enum('type', Object.values(OriginLogTypes)).notNullable()
      table.string('message').notNullable()
      table.jsonb('payload').notNullable()

      table.dateTime('created_at').defaultTo('$now')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
