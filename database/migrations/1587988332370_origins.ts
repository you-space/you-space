import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OriginTypes } from 'App/Models/Origin'

export default class Origins extends BaseSchema {
  protected tableName = 'origins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.enum('type', Object.values(OriginTypes)).notNullable()
      table.jsonb('config').notNullable().defaultTo('{}')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
