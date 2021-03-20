import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VideosProviders extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('video_id').notNullable()
      table.integer('origin_id').references('origins.id').notNullable()

      table.text('name').notNullable()
      table.text('description')

      table.text('src')
      table.text('thumbnail_src')
      table.jsonb('origin_data')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
