import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class Videos extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('permission_id').references('permissions.id').notNullable()
      table.string('source_id')

      table.string('source').notNullable().defaultTo('unknown')
      table.string('slug').notNullable().unique()
      table.string('src').notNullable()

      table.string('title').notNullable()
      table.text('description').notNullable().defaultTo('')
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
