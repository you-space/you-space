import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Origins extends BaseSchema {
  protected tableName = 'type_fields'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('type_id').references('types.id').notNullable().onDelete('CASCADE')
      table.enum('type', ['mapped', 'editable']).notNullable()
      table.string('name').notNullable()
      table.jsonb('options').notNullable().defaultTo('{}')

      table.unique(['type_id', 'name'])

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
