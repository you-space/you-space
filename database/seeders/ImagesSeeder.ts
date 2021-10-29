import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { ImageFactory } from 'Database/factories'

export default class ImagesSeederSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await ImageFactory.createMany(100)
  }
}
