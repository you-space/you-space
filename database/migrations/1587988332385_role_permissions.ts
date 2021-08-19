import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class RolePermissions extends BaseSchema {
  protected tableName = 'role_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('role_id').notNullable().references('roles.id')
      table.integer('permission_id').notNullable().references('permissions.id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
