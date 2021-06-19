import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Origins extends BaseSchema {
  protected tableName = 'item_type_fields'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('type_id').references('item_types.id').notNullable().onDelete('CASCADE')
      table.string('name').notNullable()
      table.jsonb('options').notNullable().defaultTo('{}')

      table.unique(['type_id', 'name'])

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
