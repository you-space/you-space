import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VideoImages extends BaseSchema {
  protected tableName = 'video_images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('video_id').notNullable().references('videos.id').onDelete('CASCADE')
      table.integer('image_id').notNullable().references('images.id').onDelete('CASCADE')

      table.unique(['video_id', 'image_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
