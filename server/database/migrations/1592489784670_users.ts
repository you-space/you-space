import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.integer('origin_id').references('origins.id')
      table.string('origin_user_id')

      table.string('username', 255).unique()
      table.string('display_username', 255)
      table.string('avatar_src')

      table.string('email', 255).unique()
      table.string('password', 180)
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
