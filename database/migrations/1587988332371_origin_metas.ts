import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class Origins extends BaseSchema {
  protected tableName = 'origin_metas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('origin_id').references('origins.id').notNullable()
      table.string('name').notNullable()
      table.string('value')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
