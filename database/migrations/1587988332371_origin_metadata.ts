import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OriginMetadata extends BaseSchema {
  protected tableName = 'origin_metadata'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('origin_id').notNullable().references('origins.id').unique()
      table.integer('total_videos').notNullable().defaultTo(0)
      table.integer('registered_videos').notNullable().defaultTo(0)
      table.integer('total_subscribers').notNullable().defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
