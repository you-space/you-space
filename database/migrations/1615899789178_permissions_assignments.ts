import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionsAssignments extends BaseSchema {
  protected tableName = 'permissions_assignments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('role_id').references('roles.id')
      table.integer('permission_id').references('permissions.id')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
