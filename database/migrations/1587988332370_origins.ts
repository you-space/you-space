import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class Origins extends BaseSchema {
  protected tableName = 'origins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name').notNullable().unique()
      table.string('provider_name').notNullable()
      table.boolean('active').notNullable().defaultTo(false)
      table.jsonb('config').notNullable().defaultTo(JSON.stringify({}))

      table.timestamps(true, true)
      table.dateTime('deleted_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
