import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EntityItemMetas extends BaseSchema {
  protected tableName = 'item_metas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('item_id').references('items.id').notNullable().onDelete('CASCADE')

      table.string('name', 64).notNullable()
      table.text('value')

      table.unique(['item_id', 'name'])

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
