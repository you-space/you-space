import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Origins extends BaseSchema {
  protected tableName = 'item_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.jsonb('options').notNullable().defaultTo('{}')

      table.timestamps(true)
      table.dateTime('deleted_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
