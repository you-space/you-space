import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EntityItemMetas extends BaseSchema {
  protected tableName = 'entity_item_metas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('entity_item_id').references('entity_items.id').notNullable()
      table.string('name').notNullable()
      table.string('value')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
