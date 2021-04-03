import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VisibilityPermissions extends BaseSchema {
  protected tableName = 'visibility_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('visibility_id').notNullable().references('visibilities.id')
      table.integer('permission_id').notNullable().references('permissions.id')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
