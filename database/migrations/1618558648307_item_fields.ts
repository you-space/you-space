import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EntityItemMetas extends BaseSchema {
  protected tableName = 'item_fields'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('item_id').references('items.id').notNullable().onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('type').notNullable().defaultTo('text')

      table.text('value')

      table.unique(['item_id', 'name'])

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
