import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Visibility from 'App/Models/Visibility'

export default class VideosProviders extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    const privateVisibility = await Visibility.firstOrCreate({
      name: 'private',
    })

    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('video_id').notNullable()
      table.integer('origin_id').references('origins.id').notNullable()
      table
        .integer('visibility_id')
        .references('visibilities.id')
        .notNullable()
        .defaultTo(privateVisibility.id)

      table.jsonb('origin_data')

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
