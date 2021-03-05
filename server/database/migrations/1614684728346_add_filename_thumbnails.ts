import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('filename_thumbnail')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('filename_thumbnail')
    })
  }
}
