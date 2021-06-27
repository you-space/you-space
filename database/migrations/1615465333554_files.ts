import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Files extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.enum('type', ['video', 'image', 'other']).notNullable().defaultTo('other')
      table.string('extname').notNullable()
      table.string('filename').notNullable().unique()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
