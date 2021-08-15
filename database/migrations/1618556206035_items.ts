import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Visibility from 'App/Models/Visibility'

export default class Origins extends BaseSchema {
  protected tableName = 'items'

  public async up() {
    const visibility = await Visibility.firstOrCreate({
      name: 'private',
    })
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('origin_id').references('origins.id').notNullable().onDelete('CASCADE')
      table.integer('type_id').references('types.id').notNullable().onDelete('CASCADE')
      table.integer('parent_id').references('items.id').onDelete('CASCADE')

      table.text('source_id').notNullable()

      table
        .integer('visibility_id')
        .references('visibilities.id')
        .defaultTo(visibility.id)
        .notNullable()

      table.jsonb('value').notNullable().defaultTo('{}')

      table.timestamps(true, true)
      table.dateTime('deleted_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
