import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class YsOptions extends BaseSchema {
  protected tableName = 'system_metas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 64).unique().notNullable()
      table.text('value')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
