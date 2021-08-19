import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ItemFiles extends BaseSchema {
  protected tableName = 'item_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 64)

      table.integer('item_id').references('items.id').notNullable()
      table.integer('file_id').references('files.id').notNullable()

      table.unique(['item_id', 'file_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
