import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Comments extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('source_id')
      table.string('source').notNullable().defaultTo('unknown')

      table.integer('parent_id').references('comments.id')
      table.integer('video_id').notNullable().references('videos.id').onDelete('CASCADE')

      table.string('avatar_src')
      table.string('username').notNullable()
      table.string('content').notNullable()

      table.dateTime('published_at').notNullable().defaultTo('$now')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
