import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { VideoFactory } from 'Database/factories'

export default class VideoSeederSeeder extends BaseSeeder {
  public async run() {
    await VideoFactory.createMany(100)
  }
}
