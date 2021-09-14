import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ItemFiles extends BaseSchema {
  protected tableName = 'item_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('type_field_id').references('type_fields')

      table.integer('item_id').references('items.id').notNullable().onDelete('CASCADE')
      table.integer('file_id').references('files.id').notNullable().onDelete('CASCADE')

      table.unique(['item_id', 'file_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
