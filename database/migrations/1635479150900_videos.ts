import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Visibility from 'App/Models/Visibility'

export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    const visibility = await Visibility.firstOrCreate({
      name: 'private',
    })

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('visibility_id').notNullable().defaultTo(visibility.id)
      table.string('source_id')

      table.string('source').notNullable().defaultTo('unknown')
      table.string('slug').notNullable().unique()
      table.string('src').notNullable()

      table.string('title').notNullable()
      table.string('description').notNullable()
      table.dateTime('published_at').notNullable()

      table.jsonb('raw').notNullable().defaultTo('{}')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
