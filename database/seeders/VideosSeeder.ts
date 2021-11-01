import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { VideoFactory } from 'Database/factories'

export default class VideoSeederSeeder extends BaseSeeder {
  public async run() {
    await VideoFactory.with('images', 1, (fac) => fac.merge({ name: 'default' }))
      .with('views', 3)
      .createMany(100)
  }
}
