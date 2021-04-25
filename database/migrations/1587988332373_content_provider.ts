import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class Origins extends BaseSchema {
  protected tableName = 'content_providers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('origin_id').references('origins.id').notNullable()

      table.string('name').notNullable()
      table.boolean('active').notNullable().defaultTo(false)
      table.jsonb('config').notNullable().defaultTo(JSON.stringify({}))

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
