import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { TypeFactory } from 'Database/factories'

export default class TypeSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await TypeFactory.with('items', 10).create()
  }
}
