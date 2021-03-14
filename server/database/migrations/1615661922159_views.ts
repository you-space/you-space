import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Views extends BaseSchema {
  protected tableName = 'views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.text('id').primary()
      table.text('video_id').notNullable().references('videos.id')
      table.integer('origin_id').notNullable().references('origins.id')
      table.integer('count').notNullable().defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
