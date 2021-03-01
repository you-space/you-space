import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserProviders extends BaseSchema {
  protected tableName = 'user_providers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('origin_id').notNullable().references('id').inTable('origin')
      table.integer('user_origin_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
