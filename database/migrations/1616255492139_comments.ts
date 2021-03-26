import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Comments extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.integer('origin_id').notNullable().references('origins.id')
      table.string('comment_id')

      table
        .string('parent_comment_id')
        .references('comments.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.string('user_id').notNullable().references('users.id')
      table.string('video_id').notNullable().references('videos.id')

      table.integer('like_count').notNullable().defaultTo(0)
      table.integer('unlike_count').notNullable().defaultTo(0)

      table.integer('origin_like_count').notNullable().defaultTo(0)
      table.integer('origin_unlike_count').notNullable().defaultTo(0)

      table.jsonb('origin_data')

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
