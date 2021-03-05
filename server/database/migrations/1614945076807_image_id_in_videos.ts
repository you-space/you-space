import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('filename_thumbnail')
      table.integer('image_id').references('images.id').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['image_id'])
      table.dropColumn('image_id')
      table.string('filename_thumbnail')
    })
  }
}
