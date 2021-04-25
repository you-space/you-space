import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EntityItemMetas extends BaseSchema {
  protected tableName = 'item_metas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('item_id').references('items.id').notNullable()
      table.string('name').notNullable()
      table.text('value')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
