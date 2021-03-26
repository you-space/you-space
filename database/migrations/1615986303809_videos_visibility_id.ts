import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Visibility from 'App/Models/Visibility'

export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    const privateVisibility = await Visibility.firstOrCreate({
      name: 'private',
    })

    this.schema.table(this.tableName, (table) => {
      table
        .integer('visibility_id')
        .notNullable()
        .references('visibilities.id')
        .after('origin_id')
        .defaultTo(privateVisibility.id)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('visibility_id')
    })
  }
}
