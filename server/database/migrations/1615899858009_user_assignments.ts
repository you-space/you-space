import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserAssignments extends BaseSchema {
  protected tableName = 'user_assignments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('role_id').references('roles.id')
      table.string('user_id').references('users.id')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
