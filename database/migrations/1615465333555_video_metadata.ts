import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VideoMetadata extends BaseSchema {
  protected tableName = 'video_metadata'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('video_id').unique().references('videos.id').notNullable()

      table.string('title')
      table.text('description')
      table.integer('video_file_id').references('files.id')
      table.integer('thumbnail_file_id').references('files.id')

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
