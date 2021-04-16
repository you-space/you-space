import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Views extends BaseSchema {
  protected tableName = 'views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('entity_item_id').notNullable().references('entity_items.id')
      table.integer('source_count').notNullable().defaultTo(0)
      table.integer('count').notNullable().defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
