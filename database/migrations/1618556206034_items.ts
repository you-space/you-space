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
      table.integer('content_provider_id').references('content_providers.id').notNullable()
      table.integer('entity_id').references('entities.id').notNullable()

      table.integer('parent_id').references('items.id')

      table.text('source_id').notNullable()

      table
        .integer('visibility_id')
        .references('visibilities.id')
        .defaultTo(visibility.id)
        .notNullable()

      table.jsonb('value').notNullable().defaultTo('{}')

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
